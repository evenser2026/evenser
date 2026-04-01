export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append(
    'upload_preset',
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'evenser_uploads'
  )

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) throw new Error('Error al subir imagen')
  const data = await res.json()
  return data.secure_url as string
}
