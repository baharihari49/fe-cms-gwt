import SimpleImageUpload from "@/components/SimpleImageUpload"
import CloudinaryImageUpload from "@/components/CloudinaryImageUpload"

export default function page() {
    return (
        <>
              <CloudinaryImageUpload
                  value={''}
                //   onChange={}
                  placeholder="Upload project main image"
                />
        </>
    )
}