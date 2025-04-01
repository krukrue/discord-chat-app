import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gxskjlliyelsmtimftrh.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey!)

export async function uploadFile(fileBuffer: Buffer, originalFileName: string) {
  const timestamp = Date.now();
  const extension = originalFileName.split('.').pop();
  const uniqueFileName = `${originalFileName.split('.')[0]}_${timestamp}.${extension}`;
  
  const { error } = await supabase.storage
    .from("storage123")
    .upload(uniqueFileName, fileBuffer, { contentType: "application/octet-stream" });
  
  if (error) throw new Error("Ошибка загрузки: " + error.message);
  
  const { data: { publicUrl } } = supabase.storage
    .from("storage123")
    .getPublicUrl(uniqueFileName);
    
  return publicUrl;
}