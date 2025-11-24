// src/services/imageService.js (ajusta o caminho conforme seu projeto)
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';
import { supabase } from '../lib/supabase';
import { supabaseUrl } from '../constants';

export const getUserImageSrc = (imagePath) => {
  if (imagePath) {
    // aqui imagePath deve ser UMA URL HTTP (vinda do Supabase)
    return { uri: imagePath };
  } else {
    return require('../assets/images/defaultUser.png');
  }
};


export const getSupabaseFileUrl = (filePath) => {
  if (!filePath) return null;
  return { uri: filePath }; // já é a URL pública
};

// export const getSupabaseFileUrl = filePath =>{
//     if(filePath){
//         return {uri: `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`}
//     }
//     return null;
// }

export const uploadFile = async (folderName, fileUri, isImage = true) => {
  try {
    const fileName = getFilePath(folderName, isImage);

    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: 'base64', // usando a API legacy
    });

    const fileData = decode(fileBase64);

    const { data, error } = await supabase.storage
      .from('uploads') // <-- nome do bucket no Supabase
      .upload(fileName, fileData, {
        cacheControl: '3600',
        upsert: false,
        contentType: isImage ? 'image/png' : 'video/mp4',
      });

    if (error) {
      console.log('erro de upload', error);
      return { success: false, msg: 'Nao foi possivel dar upload' };
    }

    // gera URL pública
    const { data: publicData } = supabase.storage
      .from('uploads')
      .getPublicUrl(fileName);

    const publicUrl = publicData.publicUrl;

    return { success: true, data: publicUrl };
  } catch (error) {
    console.log('erro de upload', error);
    return { success: false, msg: 'Nao foi possivel dar upload' };
  }
};

export const getFilePath = (folderName, isImage) => {
  // SEM barra na frente
  return `${folderName}/${Date.now()}${isImage ? '.png' : '.mp4'}`;
};
