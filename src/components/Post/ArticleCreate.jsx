import { useState } from 'react';
import { BsImage } from "react-icons/bs"
const ArticleCreate = () => {
    const [preview, setPreview] = useState(null);

    function handleImageChange(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setPreview(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    }

    return (
        <div className="w-full h-full max-w-5xl mx-auto mt-10 rounded-lg shadow-lg border-t-gray-100 border-t-[1px] relative">
            <div className="w-full min-h-screen">
            
                        {/* <input type="file" accept="image/*" onChange={handleImageChange} className="w-full
            cursor-pointer absolute bottom-0 h-full z-10 opacity-0"/> */}
                        {/* {preview && <img src={preview} alt="Preview" className="w-fit h-fit z-5 absolute max-w-[200px] max-h-[200px]" />}
                        {!preview &&
                            <div className="w-full h-full absolute z-5 flex">
                                <div className="m-auto text-center">
                                    <BsImage className="text-2xl mx-auto" />
                                    <p className="mt-2 font-ibm-thai">อัปโหลดหน้าปกบทความ</p>
                                </div>
                            </div>} */}
                            
            </div>
        </div>
    )
}
export default ArticleCreate