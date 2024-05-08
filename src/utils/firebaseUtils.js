import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, getDocs, where, getCountFromServer } from 'firebase/firestore';
import { db } from '../config';
import { getStorage,ref,listAll,getDownloadURL,uploadBytes, deleteObject  } from "firebase/storage";
import { storage } from '../config';
  
// Read operation with image URL
export const readDocumentWithImageUrl = async (collectionName, productId) => {
    console.log("Debug ",`${collectionName}/${productId}`)
    const storagePath = `${collectionName}/${productId}`;
    const folderRef = ref(storage,storagePath);
    try {
        const result = await listAll(folderRef);
        if (result.items.length > 0) {
            const firstFileRef = result.items[0];
            const url = await getDownloadURL(firstFileRef);
            console.log('Debug URL:', url);
            return url;
          } else {
            console.log('Debug No files found in the folder.');
            return null;
          }
    } catch (error) {
      console.error('Error getting image URL:', error);
      return null;
    }
  };

// Read operation
export const readDocument = async (collectionName, documentId) => {
    const docRef = doc(db, collectionName, documentId);
    const docSnapshot = await getDoc(docRef);
    return docSnapshot.exists() ? docSnapshot.data() : null;
    
};

export const getAllDocument = async (collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  let result = [];
  querySnapshot.forEach((doc) => {
    if(doc.id !== "Passcode"){
      result.push({ id: doc.id, ...doc.data() });
    }
  });
  return result;
};

// Create or Update operation
export const saveDocument = async (collectionName, documentId, data) => {
    const docRef = doc(db, collectionName, documentId);
    await setDoc(docRef, data, { merge: true });
    return data;
};

// Update specific fields in a document
export const updateDocumentFields = async (collectionName, documentId, fields) => {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, fields);
    return { id: documentId, ...fields };
};

// Delete operation
export const deleteDocument = async (collectionName, documentId) => {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
    return { id: documentId };
};

// Query operation
export const queryDocuments = async (collectionName, conditions) => {
    const q = query(collection(db, collectionName, conditions));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const queryDocumentsCount = async (collectionName,field,operation,value) => {
    console.log("Hiii ",collectionName,field,operation,value)
    const q = query(collection(db, collectionName), where(field,operation,value));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
};


  // Function to delete all images in a folder
export  const deleteAllImagesInFolder = async (storageFolder, entityId) => {
    /*
    Description: Deletes all images in the specified folder associated with the given entityId.

    Args:
      storageFolder <string>: The folder path in the storage where the images are stored.
      entityId <string>: The unique identifier of the entity whose images are to be deleted eg UserId,StudioId like thing.
    */
    const folderPath = `${storageFolder}/${entityId}`;
    const folderRef = ref(storage, folderPath);
    const fileList = await listAll(folderRef);

    await Promise.all(fileList.items.map(async (fileRef) => {
      await deleteObject(fileRef);
    }));
  };
  export const deleteImagesFromUrl = async (url) => {

    const fileRef = storage.refFromURL(url); 
  
  console.log("File in database before delete exists : "
              + fileRef.exists()) 
    
  // Delete the file using the delete() method 
  fileRef.delete().then(function () { 
    
      // File deleted successfully 
      console.log("File Deleted") 
  }).catch(function (error) { 
      // Some Error occurred 
  }); 

  }
  // Function to delete images
export const deleteImages = async (storageFolder,imagesToDelete,entityId) => {
    /*
    Description: Deletes specific images associated with the given entityId.

    Args:
      imagesToDelete <array>: An array of image objects to be deleted.
      storageFolder <string>: The folder path in the storage where the images are stored.
      entityId <string>: UserId,StudioId like thing.
    */
    console.log(typeof(imagesToDelete))
    console.log(imagesToDelete)
    await Promise.all(imagesToDelete.map(async (file) => {
      const filePath = entityId ? `${storageFolder}/${entityId}/${file.filename}`: `${storageFolder}/${file.filename}`
      const fileRefToDelete = ref(storage, filePath);
      await deleteObject(fileRefToDelete);
    }));
  };

  // Function to upload new images
export const uploadImages = async (storageFolder, newImages, entityId) => {
    /*
    Description: Uploads new images associated with the given entityId.

    Args:
      newImages <array>: An array of new image objects to be uploaded.
      storageFolder <string>: The folder path in the storage where the images are stored.
      entityId <string>: UserId,StudioId like thing.
    */
   console.log(storageFolder,entityId)
    await Promise.all(newImages.map(async (newFileData) => {
      const folderPath = entityId?`${storageFolder}/${entityId}`: `${storageFolder}`;
      const fileRef = ref(storage, `${folderPath}/${newFileData.file.name}`);
      await uploadBytes(fileRef, newFileData.file);
    }));
  };

  export const getAllImagesInFolder = async (storageFolder) => {
    const folderPath = `${storageFolder}`;
    const folderRef = ref(storage, folderPath);
    
    try {
        const fileList = await listAll(folderRef);
        /*
        const imageUrls = await Promise.all(fileList.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return url;
        }));
        */

        const imageUrlsComprehensive = await Promise.all(
          fileList.items.map(async (fileRef) => {
            const downloadURL = await getDownloadURL(fileRef);
  
            return {
              id: fileRef.name,
              filename: fileRef.name,
              fileURL: downloadURL,
            };
          })
        );

        // return imageUrls;
        return imageUrlsComprehensive
    } catch (error) {
        console.error('Error retrieving images:', error);
        throw error;
    }
};

 export const uploadOneImageAndGetURL = async (storageFolder, file, entityId) => {
    try {
      const folderPath = `${storageFolder}/${entityId}/${file.name}`;
      console.log(folderPath)
      const fileRef = ref(storage, folderPath);
      
      await uploadBytes(fileRef, file);
  
      const imageUrl = await getDownloadURL(fileRef);
      console.log(imageUrl)
      return imageUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error; 
    }
  };

  export const getKycListFromEmail = async (userEmail, targetCollection) => {
    try {
        // Step 1: Query User Collection to get UserId
        const userQuery = query(collection(db, "User"), where("Email", "==", userEmail));
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
          return [];
        }

        let userId = "";
        userSnapshot.forEach((doc) => {
          userId = doc.id;
        });
        
        // Step 2: Query KYC collection with UserId
        const kycQuery = query(collection(db, targetCollection), where("UserId", "==", userId));
        const kycSnapshot = await getDocs(kycQuery);

        // Step 3: Check if KYC data exists
        if (kycSnapshot.empty) {
            return [];
        }

        // Step 4: Map over KYC documents
        const kycList = kycSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        console.log(kycList);
        return kycList;
    } catch (error) {
        console.error('Error fetching KYC list:', error.message);
        throw error;
    }
};

export const getListFromDiffCollectionUsingEmail = async (userEmail,targetCollection,targetFieldName) => {
  try {
      // Step 1: Query User Collection to get UserId
      const userQuery = query(collection(db, "User"), where("Email", "==", userEmail));
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        return [];
      }

      let userId = "";
      userSnapshot.forEach((doc) => {
        userId = doc.id;
      });

      console.log(userId)
      
      // Step 2: Query KYC collection with UserId
      const kycQuery = query(collection(db, targetCollection), where(targetFieldName, "==", userId));
      const kycSnapshot = await getDocs(kycQuery);
      console.log(kycSnapshot.empty,targetFieldName)
      // Step 3: Check if KYC data exists
      if (kycSnapshot.empty) {
          return [];
      }

      // Step 4: Map over KYC documents
      const kycList = kycSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
      }));
      console.log(kycList);
      return kycList;
  } catch (error) {
      console.error('Error fetching KYC list:', error.message);
      throw error;
  }
};

export const getKycListFromStatus = async (status) => {
  try {
      
      const kycQuery = query(collection(db, 'UserKyc'), where("status", "==", status));
      const kycSnapshot = await getDocs(kycQuery);

      // Step 3: Check if KYC data exists
      if (kycSnapshot.empty) {
          return [];
      }

      // Step 4: Map over KYC documents
      const kycList = kycSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
      }));
      console.log(kycList);
      return kycList;
  } catch (error) {
      console.error('Error fetching KYC list:', error.message);
      throw error;
  }
};

export const getUserByEmail = async (email) => {
        const userQuery = query(collection(db, "User"), where("Email", "==", email));
        const userSnapshot = await getDocs(userQuery);
        console.log(email)
        if (userSnapshot.empty) {
          return [];
        }

        let userData = null;
        userSnapshot.forEach((doc) => {
          userData = { id: doc.id, ...doc.data() };
        });
        console.log(userData)
        return userData;
}

export const getFTBByEmail = async (value,collectionName,key) => {
  const collectionQuery = query(collection(db, collectionName), where(key, "==", value));
  const collectionSnapshot = await getDocs(collectionQuery);
  console.log(value)
  if (collectionSnapshot.empty) {
    return [];
  }

  const collectionData = []; // Initialize an empty array to store the results
  collectionSnapshot.forEach((doc) => {
    collectionData.push({ id: doc.id, ...doc.data() }); // Push each document data into the array
  });

  console.log(collectionData);
  return collectionData;
}

export const updateDocMergeKyc = async (collectionName, kycId, data, userId) => {
  const docRef = doc(db, collectionName, kycId);
  console.log(data);
  await setDoc(docRef, data, { merge: true });

  // Fetch document from User collection
  const userDocRef = doc(db, 'User', userId);
  const userDocSnapshot = await getDoc(userDocRef);

  if (userDocSnapshot.exists()) {
    let userData = userDocSnapshot.data();
    console.log(kycId,userData.KycIdList,typeof(kycId))
    let KycIdList = userData.KycIdList
    KycIdList[kycId] = data.status
    console.log(KycIdList)
    
    await setDoc(userDocRef, {KycIdList:KycIdList},{ merge: true });
  }

  return true;
};


export const verifyAdminAndRole = async (email, pass) => {
  try {
      const adminRef = doc(db, "Admin", email);
      const adminSnap = await getDoc(adminRef);
      
      if (adminSnap.exists()) {
          const role = adminSnap.data().role;
          const passRef = doc(db, "Admin", "Passcode");
          const passSnap = await getDoc(passRef);

          if (passSnap.exists()){
              if (passSnap.data().passcode === pass){
                  return { success: true, role };
              } else {
                  return { success: false, message: "Incorrect Passcode" };
              }
          } else {
              return { success: false, message: "No Passcode Found" };
          }
      } else {
          return { success: false, message: "Unknown Email Id" };
      }
  } catch (error) {
      console.error("Error verifying admin role:", error);
      return { success: false, message: "An error occurred" };
  }
}

