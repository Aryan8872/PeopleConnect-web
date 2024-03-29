import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { authToken } from '../../root/pages/loginauth'
import { ZodType, z } from 'zod'
import { Bounce, toast } from 'react-toastify'

const ItemEditModel = ({onClose,itemId , show}) => {

    if(!show){
        return null
    }
    const localStorageData = localStorage.getItem('data');

    const parsedData = JSON.parse(localStorageData);

    const userData = parsedData.data.user;
    const userId = userData.id;
    const firstName = userData.firstName;
    const lastName = userData.lastName;
    const email = userData.email;
    const phoneNo = userData.phoneNo;

    type itemData = {
        title: string,
        price: string,
        description: string,
        location: string,


    }
    const schema: ZodType<itemData> = z.object({
        title: z.string(),
        price: z.string(),
        description: z.string(),
        location: z.string(),

    })

    const { register, handleSubmit, formState } = useForm<itemData>({ resolver: zodResolver(schema) })
    const [selectedImage, setSelectedImage] = useState(null);
    const [catId,setCatid] = useState();
    const[categories,setCategories] = useState([])




    const setCategoryid = (id)=>{
        setCatid(id)
    }

    const getCategories = async ()=>{
        await axios.get("http://localhost:8080/api/v1/auth/categories/").then((res)=>{
            setCategories(res.data)

        })
    } 
    useEffect(()=>{
        getCategories()
    },[])

    const saveItem = useMutation({
        mutationKey: "SAVEITEM",
        mutationFn: async (data: itemData) => {
            if(localStorage.getItem("jwtToken")){
                authToken(localStorage.getItem("jwtToken"))
                const item = await axios.post(`http://localhost:8080/api/v1/auth/user/${userId}/category/${catId}/item`, data).then(
                response => {
                    console.log(response)

                }
            ).catch(err => console.log(err))

        }
    }
    })
    const handleFileChange = (event) => {
        setSelectedImage(event.target.files[0]);
    };
    
    const handleUpdate = async (data: itemData) => {
        console.log(data)
        try {
            let responseImage; 
    
            if (selectedImage) {
                const formData = new FormData();
                formData.append('image', selectedImage);
    
                if (localStorage.getItem("jwtToken")) {
                    authToken(localStorage.getItem("jwtToken"));
                }
    
                responseImage = await axios.post(`http://localhost:8080/api/v1/auth/item/image/upload/${itemId}/${catId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
    
                data.imageName = responseImage.data.imageName;
            }
    
            if (localStorage.getItem("jwtToken")) {
                authToken(localStorage.getItem("jwtToken"));
            }
    
            const responsePostDetails = await axios.put(`http://localhost:8080/api/v1/auth/update/item/${itemId}/${catId}`, data);
    
            console.log('Image uploaded:', responseImage);
            console.log('Post details updated:', responsePostDetails);
            toast.success('🦄 Item edited sucessfully!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
                });
    
            onClose;
        } catch (error) {
            console.error('Error updating post:', error);
            toast.error('🦄 Error updating try again!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
                });
        }
    };
    
    return (
        <div className='item-editoverlay' >
            <div className='marketmodelContainer'  >
                <div className='upper'>
                    <div className='top'>

                        Edit item
                        <div className='back' onClick={()=>{onClose()}}>
                            x

                        </div>

                    </div>

                    {/* <div>
              <img src=''/>
            </div> */}
                </div>

                <div className='form-body'>
                    <section className='username'>
                        <div>
                            <img src="/assets/icons/profileuser.png" />
                        </div>
                        <section>
                            <span>{firstName} {lastName}</span>
                        </section>

                    </section>

                    <form className='event-form' onSubmit={handleSubmit(handleUpdate)} encType='multipart/form-data'>
                        <section className='forms'>
                            <input placeholder='Event name' className='event_input' {...register("title")} />

                            <section className='datesection'>
                                <div style={{ display: "flex", flexFlow: "column wrap" }}>
                                    <span>Category</span>
                                    <select onChange={(event) => setCategoryid(event.target.value)}>
                                        <option value={null}>Select a category</option>
                                        {categories.map((cat, key) => (
                                            <option key={key} value={cat.categoryId}>{cat.categoryTitle}</option>
                                        ))}
                                    </select>


                                </div>

                                <div style={{ display: "flex", flexFlow: "column wrap" }}>
                                    <span>Price</span>
                                    <input placeholder='Price' style={{ width: "100%" }} {...register("price")} />

                                </div>
                            </section>

                            <textarea placeholder='Description' className='description_input' {...register("description")} >
                            </textarea>

                            <input placeholder='Location' className='location-input' {...register("location")} />
                            
                            <input type='file'  onChange={handleFileChange} accept='image/*'/>



                        </section>

                        <section className='button_section'>
                            <button type='submit'>Add item</button>
                        </section>
                    </form>


                </div>

            </div>

        </div>
    )
}

export default ItemEditModel
