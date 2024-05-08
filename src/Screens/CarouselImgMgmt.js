import React, { useEffect, useState } from 'react';
import { Card, Fab, IconButton,Button as Button, Modal, Skeleton, Dialog, DialogTitle, DialogContent, DialogActions, ButtonBase, Paper, Tooltip  } from '@mui/material';
import { DeleteOutlineTwoTone, ZoomIn } from '@mui/icons-material';
import { deleteImages, deleteImagesFromUrl, getAllImagesInFolder, uploadImages } from '../utils/firebaseUtils';
import AddIcon from '@mui/icons-material/Add';
import shortid from "shortid";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function CarouselImgMgmt() {
    const [imageDataList, setImageDataList] = useState([]);
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [imageHeight, setImageHeight] = useState(400);
    const [newImages, setNewImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState(null);


    useEffect(() => {
        const calculateImageHeight = () => {
            const screenWidth = window.innerWidth;
            const aspectRatioWidth = 16;
            const aspectRatioHeight = 9;
            const desiredHeight = (screenWidth * aspectRatioHeight) / aspectRatioWidth;
            setImageHeight(desiredHeight);
        };

        calculateImageHeight();
        window.addEventListener("resize", calculateImageHeight);

        return () => {
            window.removeEventListener("resize", calculateImageHeight);
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 60000); 
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const images = await getAllImagesInFolder('LandingPageImages');
                setImageDataList(images);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, []);

    const handleDeleteFromStorage = async (imageData) => {
        // Implement delete functionality here
        setImageToDelete([imageData]);
        setDeleteConfirmationOpen(true);
        console.log('Confirmation got to Delete image with URL:', imageData,'?');
    };

    const handleDeleteConfirmation = async () => {
        // Implement delete functionality here
        console.log('Delete image with URL:');
        setDeleteConfirmationOpen(false);
        deleteImages('LandingPageImages',imageToDelete,false)
        setImageToDelete(null);
        console.log('Proceeding to delete : ',imageToDelete);
        setTimeout(() => {
            alert("Image Deleted")
            window.location.reload();
          }, 1000);
         
    };


    const handleShowImage = (imageUrl) => {
        setSelectedImageUrl(imageUrl);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedImageUrl(null);
        setModalOpen(false);
    };

    const handleSelectNew = (event) => {
        /*
        const files = event.target.files[0];
        console.log(event.target.files,files,files[0])
        setNewImages([...newImages, files]);
        console.log(newImages)
        */

        const files = Array.from(event.target.files);
        const updatedFiles = [];
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              updatedFiles.push({
                id: shortid.generate(),
                filename: file.name,
                filetype: file.type,
                fileimage: reader.result,
                 //datetime: file.lastModifiedDate.toLocaleString("en-IN"),
                //filesize: filesizes(file.size),
                file: file, // Store the actual file object
              });
      
              if (updatedFiles.length === files.length) {
                setNewImages((prevFiles) => [...prevFiles, ...updatedFiles])
              }
            };
      
            reader.readAsDataURL(file);
          });

    };

    const handleUploadNew = async () => {
        if(newImages.length===0){
            alert('No new image selected')
            return
        }
        console.log(newImages)
        uploadImages('LandingPageImages',newImages,false)
        console.log(newImages)
    };

    return (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                <h1>View/Delete present images</h1>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
            {loading ? (
                // Show loading skeleton
                <>
                <Skeleton variant="rectangular" width={350} height={200} />
                <Skeleton variant="rectangular" width={350} height={200} />
                <Skeleton variant="rectangular" width={350} height={200} />
                <Skeleton variant="rectangular" width={350} height={200} />
                </>
            ) : imageDataList.length > 0 ? (
                // Show image cards
                imageDataList.map((imageData, index) => (
                    <div key={index} style={{ width: '350px', marginBottom: 16 }}>
                        <Card style={{ maxWidth: '100%', position: 'relative' }}>
                            <img src={imageData.fileURL} alt={`Image ${index}`} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', top: 8, right: 8 }}>
                                <div style={{ background: 'rgba(255, 255, 255, 0.7)', borderRadius: '50%', padding: 4 }}>
                                    <IconButton aria-label="delete" onClick={() => handleDeleteFromStorage(imageData)}>
                                        <Tooltip title="Delete">
                                            <DeleteOutlineTwoTone />
                                        </Tooltip>
                                    </IconButton>
                                </div>
                                <div style={{ background: 'rgba(255, 255, 255, 0.7)', borderRadius: '50%', padding: 4 }}>
                                    <IconButton aria-label="show" onClick={() => handleShowImage(imageData.fileURL)}>
                                       <Tooltip title="View (real)">
                                            <ZoomIn />
                                        </Tooltip>
                                    </IconButton>
                                </div>
                            </div>
                        </Card>
                    </div>
                ))
            ) : (
                // Show "No images" message
                <div>No images</div>
            )}
        </div>

            <Paper style={{marginLeft:"1rem",marginRight:"1rem" }} elevation={4}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                <h1>Add new images</h1>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    onChange={handleSelectNew}
                    >
                    Upload file
                    <VisuallyHiddenInput type="file" accept="image/*" multiple />
                    </Button>
            </div>
            <hr/>

            <div style={{ display: 'flex',minHeight:'200px', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                {newImages.map((file, index) => (
                    <div key={index} style={{ width: '350px', marginBottom: 16 }}>
                        <Card style={{ maxWidth: '100%', position: 'relative' }}>
                            <img src={file.fileimage ? file.fileimage : file.fileURL} alt={`New Image ${index}`} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', top: 8, right: 8 }}>
                                <div style={{ background: 'rgba(255, 255, 255, 0.7)', borderRadius: '50%', padding: 4 }}>
                                    <IconButton aria-label="delete" onClick={() => setNewImages(newImages.filter((_, i) => i !== index))}>
                                        <Tooltip title="Delete">
                                            <DeleteOutlineTwoTone />
                                        </Tooltip>
                                    </IconButton>
                                </div>
                                <div style={{ background: 'rgba(255, 255, 255, 0.7)', borderRadius: '50%', padding: 4 }}>
                                    <IconButton aria-label="show" onClick={() => handleShowImage(file.fileimage ? file.fileimage : file.fileURL)}>
                                       <Tooltip title="View (real)">
                                            <ZoomIn />
                                        </Tooltip>
                                    </IconButton>
                                </div>
                            </div>
                        </Card>
                        
                    </div>
                ))}
                
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
            <Button variant="contained" onClick={handleUploadNew} >Upload</Button>
            </div>
            <br/>

            </Paper>
            <br/>

            <Modal open={modalOpen} onClose={handleCloseModal} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                    src={selectedImageUrl}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        borderRadius: 8,
                        padding: 16,
                        height: window.innerWidth > 768 ? '50vh' : `${imageHeight}px`,
                        width: "100%",
                        objectFit: "cover"
                    }}
                />
            </Modal>

            <Dialog
                open={deleteConfirmationOpen}
                onClose={() => setDeleteConfirmationOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Delete Confirmation</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this image?
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" sx={{backgroundColor:"green"}} onClick={() => setDeleteConfirmationOpen(false)}>Cancel</Button>
                    <Button  variant="contained" sx={{backgroundColor:"red"}} onClick={handleDeleteConfirmation} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}

export default CarouselImgMgmt;

// <input type="file" accept="image/*" onChange={handleSelectNew} multiple  />