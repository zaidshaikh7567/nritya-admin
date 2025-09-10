import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  IconButton,
  Grid,
  MenuItem,
  Container,
  Button as MuiButton,
  FormControl,
  ButtonGroup,
  Select,
  Autocomplete,
  Stack,
} from "@mui/material";
import {
  Add,
  CloseOutlined,
  Close,
  Delete,
  CloudUpload,
  YouTube,
  Image,
} from "@mui/icons-material";
import { BASEURL_PROD } from "../../constants";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import dayjs from "dayjs";
import { Form } from "react-bootstrap";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import WorkshopStep2EventInfo from "./WorkshopStep2EventInfo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Header from "../Header";

const FORM_FIELD_HEIGHT = 56;

// Mock data for dance styles and cities
const danceStylesOptions = [
  "Bharatanatyam", "Kathak", "Odissi", "Kuchipudi", "Manipuri", "Mohiniyattam", "Sattriya",
  "Contemporary", "Hip Hop", "Jazz", "Ballet", "Salsa", "Bachata", "Tango", "Waltz",
  "Bollywood", "Folk Dance", "Classical", "Modern", "Fusion"
];

const cityOptions = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad",
  "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal",
  "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad", "Ludhiana",
  "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivali", "Vasai-Virar",
  "Varanasi", "Srinagar", "Aurangabad", "Navi Mumbai", "Solapur", "Vijayawada", "Kolhapur",
  "Amritsar", "Nashik", "Sangli", "Malegaon", "Ulhasnagar", "Jalgaon", "Akola", "Latur",
  "Ahmadnagar", "Dhule", "Ichalkaranji", "Parbhani", "Jalna", "Bhusawal", "Panvel",
  "Satara", "Beed", "Yavatmal", "Kamptee", "Gondia", "Barshi", "Achalpur", "Osmanabad",
  "Nanded-Waghala", "Sangli-Miraj & Kupwad", "Malegaon", "Lonavla", "Deolali", "Chalisgaon",
  "Bhiwandi", "Jalgaon", "Amalner", "Dhule", "Ichalkaranji", "Parbhani", "Jalna", "Bhusawal"
];

const stateOptions = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh",
  "Lakshadweep", "Puducherry"
];

const LEVELS = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate", 
  ADVANCED: "Advanced",
  ALL_LEVELS: "All Levels"
};

const initialValue = {
  name: "",
  description: "",
  dance_styles: [],
  youtube_link: "",
  level: "",
  start_date: null,
  end_date: null,
  creator_email: "",
  venueType: "Studio", // Studio | Independent
  venueDetails: null, // Unified structure: { studio: "", address: "", buildingName: "", landmark: "", streetAddress: "", pincode: "", city: "", state: "", mapAddress: "", selectedLocation: "" }
  building: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
  mapAddress: "",
  geolocation: {
    lat: null,
    lng: null,
  },
  variants: [
    {
      date: null,
      time: "",
      description: "",
      subvariants: [
        {
          price: "",
          capacity: "",
          description: "",
        },
      ],
    },
  ],
};

const theme = createTheme({
  typography: {
    fontFamily: '"Nunito Sans", sans-serif',
  },
});

const WorkshopForm = ({ 
  entityId, 
  baseUrlServer, 
  isUpdating, 
  formData, 
  setFormData, 
  errors, 
  onBack, 
  onSubmit 
}) => {
  const [step, setStep] = useState(1);
  const [isVideoLink, setIsVideoLink] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workshopIconUrl, setWorkshopIconUrl] = useState("");
  const [studios, setStudios] = useState([]);
  const [loadingStudios, setLoadingStudios] = useState(false);
  const [isCreatorEmailValid, setIsCreatorEmailValid] = useState(false);

  useEffect(() => {
    if (isUpdating && formData) {
      // If editing existing workshop, check if it has a video link
      if (formData.youtube_link) {
        setIsVideoLink(true);
      }
    }
  }, [isUpdating, formData]);

  useEffect(() => {
    const validateCreatorEmailAndFetchStudios = async () => {
      if (!formData.creator_email) {
        setIsCreatorEmailValid(false);
        setStudios([]);
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.creator_email)) {
        setIsCreatorEmailValid(false);
        setStudios([]);
        return;
      }

      try {
        setLoadingStudios(true);
        
        // First validate if user exists
        const userResponse = await fetch(
          `${baseUrlServer}crud/getUserDataByEmail/${encodeURIComponent(formData.creator_email)}`
        );

        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.data && Object.keys(userData.data).length > 0) {
            setIsCreatorEmailValid(true);
            
            // Now fetch studios for this creator
            const studiosResponse = await fetch(
              `${baseUrlServer}crud/listStudiosWithFilters/?creatorEmail=${encodeURIComponent(formData.creator_email)}`
            );

            if (studiosResponse.ok) {
              const studiosData = await studiosResponse.json();
              setStudios(studiosData.data || []);
              console.log("Studios loaded:", studiosData.data);
            } else {
              console.error("Failed to fetch studios:", studiosResponse.statusText);
              setStudios([]);
            }
          } else {
            setIsCreatorEmailValid(false);
            setStudios([]);
          }
        } else {
          setIsCreatorEmailValid(false);
          setStudios([]);
        }
      } catch (error) {
        console.error("Error validating creator email or fetching studios:", error);
        setIsCreatorEmailValid(false);
        setStudios([]);
      } finally {
        setLoadingStudios(false);
      }
    };

    validateCreatorEmailAndFetchStudios();
  }, [formData.creator_email, baseUrlServer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, workshopImage: file }));
      const imageUrl = URL.createObjectURL(file);
      setWorkshopIconUrl(imageUrl);
    }
  };

  const handleDateChange = (name) => (date) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleVenueTypeChange = (e) => {
    const venueType = e.target.value;
    setFormData((prev) => ({
      ...prev,
      venueType,
      venueDetails:
        venueType === "Studio"
          ? {
              studio: "",
              address: "",
              buildingName: "",
              landmark: "",
              streetAddress: "",
              pincode: "",
              city: "",
              state: "",
              mapAddress: "",
              selectedLocation: null,
            }
          : {
              buildingName: "",
              landmark: "",
              streetAddress: "",
              pincode: "",
              city: "",
              state: "",
              mapAddress: "",
              selectedLocation: null,
            },
    }));
  };

  const handleStudioChange = (e) => {
    const studioId = e.target.value;
    const selectedStudio = studios.find(
      (studioIdItem) => studioIdItem?.id === studioId
    );

    if (selectedStudio) {
      setFormData((prev) => ({
        ...prev,
        venueDetails: {
          studio: studioId,
          address: "",
          buildingName: selectedStudio.buildingName || "",
          landmark: selectedStudio.landmark || "",
          streetAddress: selectedStudio.street || "",
          pincode: selectedStudio.pincode || "",
          city: selectedStudio.city || "",
          state: selectedStudio.state || "",
          mapAddress: `${selectedStudio.buildingName || ""}, ${
            selectedStudio.street
          }, ${selectedStudio.city}, ${selectedStudio.state}, ${
            selectedStudio.country
          } - ${selectedStudio.pincode}`,
          selectedLocation: selectedStudio.geolocation ? {
            lat: selectedStudio.geolocation.lat,
            lng: selectedStudio.geolocation.lng
          } : null,
        },
        // Map studio data to main form fields
        building: selectedStudio.buildingName || "",
        street: selectedStudio.street || "",
        city: selectedStudio.city || "",
        state: selectedStudio.state || "",
        pincode: selectedStudio.pincode || "",
        mapAddress: `${selectedStudio.buildingName || ""}, ${
          selectedStudio.street
        }, ${selectedStudio.city}, ${selectedStudio.state}, ${
          selectedStudio.country
        } - ${selectedStudio.pincode}`,
        // Map geolocation data
        geolocation: selectedStudio.geolocation ? {
          lat: selectedStudio.geolocation.lat,
          lng: selectedStudio.geolocation.lng
        } : null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        venueDetails: {
          studio: "",
          address: "",
          buildingName: "",
          landmark: "",
          streetAddress: "",
          pincode: "",
          city: "",
          state: "",
          mapAddress: "",
          selectedLocation: null,
        },
        // Clear main form fields when no studio selected
        building: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        mapAddress: "",
        geolocation: {
          lat: null,
          lng: null,
        },
      }));
    }
  };

  const handleIndependentVenueChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      venueDetails: { ...prev.venueDetails, [name]: value },
      [name]: value, // Also update the main form data
    }));
  };

  const isValidInputs = () => {
    if (step === 1) {
      if (
        !formData.name ||
        !formData.creator_email ||
        !formData.description ||
        !formData.dance_styles?.length ||
        !formData.level ||
        !formData.venueType ||
        !formData.start_date ||
        !formData.end_date
      ) {
        return false;
      }

      // Check venue-specific fields
      if (formData.venueType === "Studio") {
        if (!formData.venueDetails?.studio || !formData.building || !formData.street || !formData.city) {
          return false;
        }
      } else if (formData.venueType === "Independent") {
        if (
          !formData.venueDetails?.streetAddress ||
          !formData.venueDetails?.city
        ) {
          return false;
        }
      }

      if (!isVideoLink) {
        if (!formData.workshopImage && !isUpdating) {
          return false;
        }
      } else {
        if (!formData.youtube_link) {
          return false;
        }
      }

      return true;
    } else {
      if (!formData.variants?.length) {
        return false;
      }

      for (const variant of formData.variants) {
        if (
          !variant.date ||
          !variant.time ||
          !variant.description ||
          !variant.subvariants?.length
        ) {
          return false;
        }

        for (const subvariant of variant.subvariants) {
          if (!subvariant.price || !subvariant.capacity || !subvariant.description) {
            return false;
          }
        }
      }

      return true;
    }
  };

  const gotoStep2 = async (event) => {
    event.preventDefault();

    if (!isValidInputs()) {
      alert("Please fill all the fields.");
      return;
    }

    setStep((prev) => prev + 1);
  };

  const clearForm = () => {
    setFormData(initialValue);
    setIsVideoLink(false);
  };

  const handleAddWorkshop = async (event) => {
    event.preventDefault();

    if (!isValidInputs()) {
      alert("Please fill all the fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      const transformedWorkshop = {
        name: formData.name,
        description: formData.description,
        dance_styles: formData.dance_styles.join(", "),
        youtube_link: formData.youtube_link || "",
        level: formData.level,
        start_date: formData.start_date
          ? dayjs(formData.start_date).format("YYYY-MM-DD")
          : "",
        end_date: formData.end_date
          ? dayjs(formData.end_date).format("YYYY-MM-DD")
          : "",
        creator_email: formData.creator_email,
        // Unified venue transformation for both Studio and Independent
        ...(formData.venueDetails
          ? {
              building: formData.venueDetails.buildingName || formData.building || "",
              street: formData.venueDetails.streetAddress || formData.street || "",
              city: formData.venueDetails.city || formData.city || "",
              state: formData.venueDetails.state || formData.state || "",
              pincode: formData.venueDetails.pincode || formData.pincode || "",
              geolocation: formData.venueDetails.selectedLocation || formData.geolocation || null,
              mapAddress: formData.venueDetails.mapAddress || formData.mapAddress || "",
            }
          : {
              building: formData.building || "",
              street: formData.street || "",
              city: formData.city || "",
              state: formData.state || "",
              pincode: formData.pincode || "",
              geolocation: formData.geolocation || null,
              mapAddress: formData.mapAddress || "",
            }),
      };

      const transformedVariants = formData.variants.map((variant, index) => ({
        variant_id: `NEW_${index + 1}`,
        date: variant.date ? dayjs(variant.date).format("YYYY-MM-DD") : "",
        time: variant.time || "",
        description: variant.description,
        subvariants: variant.subvariants.map((sub, pIndex) => ({
          subvariant_id: `NEW_${index}_${pIndex + 1}`,
          price: sub.price,
          capacity: sub.capacity,
          description: sub.description,
        })),
      }));

      const payload = {
        workshop: transformedWorkshop,
        variants: transformedVariants,
      };

      let response;
      let workshopId;

      if (isUpdating) {
        response = await fetch(
          `${baseUrlServer}crud/update_workshop/${entityId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        workshopId = entityId;
      } else {
        response = await fetch(`${baseUrlServer}crud/create_workshop/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        const result = await response.json();

        if (!isUpdating && result.workshop_id) {
          workshopId = result.workshop_id;
        }

        if (formData.workshopImage && workshopId) {
          try {
            const formDataUpload = new FormData();
            formDataUpload.append("images", formData.workshopImage);
            formDataUpload.append("entity_id", workshopId);

            const iconResponse = await fetch(
              `${baseUrlServer}imagesCrud/workshopIcon/`,
              {
                method: "POST",
                body: formDataUpload,
              }
            );

            if (iconResponse.ok) {
              alert(
                isUpdating
                  ? "Workshop and image updated successfully!"
                  : "Workshop and image created successfully!"
              );
            } else {
              alert(
                "Workshop saved but image upload failed. You can upload the image later."
              );
            }
          } catch (iconError) {
            console.error("Error uploading workshop image:", iconError);
            alert(
              "Workshop saved but image upload failed. You can upload the image later."
            );
          }
        } else {
          alert(
            isUpdating
              ? "Workshop successfully updated."
              : "Workshop successfully added."
          );
        }

        clearForm();
        onSubmit();
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to save workshop");
      }
    } catch (error) {
      console.error("Error saving workshop:", error);
      alert(error?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Container component="main" className="flex-grow-1">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                my: 3,
                color: "black",
                fontFamily: "Nunito Sans",
                textTransform: "none",
                fontWeight: 500,
                letterSpacing: 0.5,
                fontSize: "30px",
              }}
            >
              {isUpdating ? "Edit Workshop" : "Add New Workshop"}
            </Typography>
            <IconButton onClick={onBack}>
              <CloseOutlined />
            </IconButton>
          </Box>

          <Paper
            elevation={2}
            sx={{
              my: 3,
              p: 3,
              borderRadius: 2,
              bgcolor: "unset",
            }}
          >
            {step === 1 && (
              <Form id="addWorkshopForm" onSubmit={gotoStep2}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "black",
                    textTransform: "capitalize",
                  }}
                  gutterBottom
                >
                  Workshop Info
                </Typography>

                <Grid container rowSpacing={3} columnSpacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "16px",
                        color: "black",
                      }}
                      gutterBottom
                    >
                      Creator Email
                    </Typography>
                    <TextField
                      fullWidth
                      name="creator_email"
                      type="email"
                      sx={{ height: FORM_FIELD_HEIGHT }}
                      variant="outlined"
                      InputLabelProps={{ shrink: false }}
                      placeholder="Enter creator email"
                      value={formData.creator_email}
                      onChange={handleChange}
                    />
                    {formData.creator_email && (
                      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        {loadingStudios ? (
                          <>
                            <Typography variant="body2" color="info.main">
                              Validating email and loading studios...
                            </Typography>
                          </>
                        ) : isCreatorEmailValid ? (
                          <>
                            <Typography variant="body2" color="success.main">
                              ✓ Email validated. {studios.length} studio(s) found.
                            </Typography>
                          </>
                        ) : (
                          <>
                            <Typography variant="body2" color="error.main">
                              ✗ Invalid email or user not found.
                            </Typography>
                          </>
                        )}
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "16px",
                        color: "black",
                      }}
                      gutterBottom
                    >
                      Workshop Name
                    </Typography>
                    <TextField
                      fullWidth
                      name="name"
                      sx={{ height: FORM_FIELD_HEIGHT }}
                      variant="outlined"
                      InputLabelProps={{ shrink: false }}
                      placeholder="Enter workshop name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isCreatorEmailValid}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "16px",
                        color: "black",
                      }}
                      gutterBottom
                    >
                      Description
                    </Typography>
                    <ReactQuill
                      theme="snow"
                      placeholder="Enter Description"
                      value={formData.description}
                      onChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          description: value,
                        }));
                      }}
                      readOnly={!isCreatorEmailValid}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                        flexWrap: "wrap",
                        gap: 2,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "16px" }}
                        gutterBottom
                      >
                        Workshop Media
                      </Typography>
                      <Box sx={{ display: "flex" }}>
                        <ButtonGroup>
                          <Button
                            size="small"
                            variant={!isVideoLink ? "contained" : "outlined"}
                            onClick={() => setIsVideoLink(false)}
                            startIcon={<Image />}
                            disabled={!isCreatorEmailValid}
                            sx={{
                              textTransform: "capitalize",
                              ...(!isVideoLink && {
                                bgcolor: "#67569E",
                                color: "white",
                                "&:hover": {
                                  bgcolor: "#67569E",
                                  color: "white",
                                },
                              }),
                              ...(isVideoLink && {
                                color: "text.primary",
                                borderColor: "divider",
                                "&:hover": {
                                  bgcolor: "action.hover",
                                  borderColor: "divider",
                                },
                              }),
                            }}
                          >
                            Upload Image
                          </Button>
                          <Button
                            size="small"
                            variant={isVideoLink ? "contained" : "outlined"}
                            onClick={() => setIsVideoLink(true)}
                            startIcon={<YouTube />}
                            disabled={!isCreatorEmailValid}
                            sx={{
                              textTransform: "capitalize",
                              ...(isVideoLink && {
                                bgcolor: "#67569E",
                                color: "white",
                                "&:hover": {
                                  bgcolor: "#67569E",
                                  color: "white",
                                },
                              }),
                              ...(!isVideoLink && {
                                color: "text.primary",
                                borderColor: "divider",
                                "&:hover": {
                                  bgcolor: "action.hover",
                                  borderColor: "divider",
                                },
                              }),
                            }}
                          >
                            YouTube Link
                          </Button>
                        </ButtonGroup>
                      </Box>
                    </Box>

                    {!isVideoLink ? (
                      <Box>
                        <Button
                          fullWidth
                          variant="outlined"
                          component="label"
                          startIcon={<CloudUpload sx={{ fontSize: 20 }} />}
                          disabled={!isCreatorEmailValid}
                          sx={{
                            height: FORM_FIELD_HEIGHT,
                            color: "black",
                            borderColor: "#0000003b",
                            "&:hover": {
                              borderColor: "#0000003b",
                            },
                          }}
                        >
                          Upload Workshop Image
                          <input
                            hidden
                            type="file"
                            accept="image/*"
                            name="workshopImage"
                            onChange={handleImageUpload}
                            disabled={!isCreatorEmailValid}
                          />
                        </Button>
                        {formData?.workshopImage && (
                          <Box
                            sx={{
                              fontSize: 12,
                              marginTop: 1,
                              color: "black",
                            }}
                          >
                            Selected file: {formData?.workshopImage?.name}
                          </Box>
                        )}
                        {workshopIconUrl && (
                          <Box
                            sx={{
                              position: "relative",
                              display: "inline-block",
                              marginTop: 2,
                              border: "1px solid #e0e0e0",
                              borderRadius: 1,
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              component="img"
                              src={workshopIconUrl}
                              alt="Workshop preview"
                              sx={{
                                width: "100%",
                                maxWidth: 300,
                                height: "auto",
                                display: "block",
                              }}
                            />
                            <IconButton
                              onClick={() => setWorkshopIconUrl("")}
                              sx={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                bgcolor: "red",
                                color: "white",
                                width: 24,
                                height: 24,
                                "&:hover": {
                                  bgcolor: "darkred",
                                  color: "white",
                                },
                              }}
                            >
                              <Close sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <TextField
                        fullWidth
                        name="youtube_link"
                        value={formData.youtube_link || ""}
                        onChange={handleChange}
                        sx={{ height: FORM_FIELD_HEIGHT }}
                        variant="outlined"
                        InputLabelProps={{ shrink: false }}
                        placeholder="https://www.youtube.com/watch?v=..."
                        disabled={!isCreatorEmailValid}
                      />
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "16px",
                        color: "black",
                      }}
                      gutterBottom
                    >
                      Dance Styles
                    </Typography>
                    <Autocomplete
                      multiple
                      id="tags-standard"
                      options={danceStylesOptions}
                      value={formData.dance_styles}
                      onChange={(_, value) => {
                        setFormData((prev) => ({
                          ...prev,
                          dance_styles: value,
                        }));
                      }}
                      disabled={!isCreatorEmailValid}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select Dance Styles"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "16px",
                        color: "black",
                      }}
                      gutterBottom
                    >
                      Level
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        displayEmpty
                        disabled={!isCreatorEmailValid}
                        sx={{ height: FORM_FIELD_HEIGHT }}
                      >
                        <MenuItem value="">Select level</MenuItem>
                        {Object.values(LEVELS).map((level, index) => (
                          <MenuItem key={index} value={level}>
                            {level}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "16px",
                        color: "black",
                      }}
                      gutterBottom
                    >
                      Venue Type
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        name="venueType"
                        value={formData.venueType || ""}
                        onChange={handleVenueTypeChange}
                        displayEmpty
                        disabled={!isCreatorEmailValid}
                        sx={{ height: FORM_FIELD_HEIGHT }}
                      >
                        <MenuItem value="Studio">Studio address</MenuItem>
                        <MenuItem value="Independent">
                          Independent location
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "16px",
                        color: "black",
                      }}
                      gutterBottom
                    >
                      Start Date
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={formData.start_date ? dayjs(formData.start_date) : null}
                        onChange={(date) => handleDateChange("start_date")(date)}
                        disabled={!isCreatorEmailValid}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            sx={{ height: FORM_FIELD_HEIGHT }}
                            variant="outlined"
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "16px",
                        color: "black",
                      }}
                      gutterBottom
                    >
                      End Date
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={formData.end_date ? dayjs(formData.end_date) : null}
                        onChange={(date) => handleDateChange("end_date")(date)}
                        minDate={formData.start_date ? dayjs(formData.start_date) : null}
                        disabled={!isCreatorEmailValid}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            sx={{ height: FORM_FIELD_HEIGHT }}
                            variant="outlined"
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>

                  {formData.venueType === "Studio" && (
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "16px",
                          color: "black",
                        }}
                        gutterBottom
                      >
                        Select Studio Address
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          name="studio"
                          value={formData.venueDetails?.studio || ""}
                          onChange={handleStudioChange}
                          displayEmpty
                          sx={{ height: FORM_FIELD_HEIGHT }}
                          disabled={loadingStudios || !isCreatorEmailValid}
                        >
                          <MenuItem value="">
                            {loadingStudios 
                              ? "Loading studios..." 
                              : studios.length === 0 
                                ? "No studios found for this creator" 
                                : "Select studio address"}
                          </MenuItem>
                          {studios.map((studio, index) => {
                            const studioAddress = `${
                              studio.buildingName
                                ? studio.buildingName + ", "
                                : ""
                            }${studio.street}, ${studio.city}, ${
                              studio.state
                            }, ${studio.country} - ${studio.pincode}`;

                            return (
                              <MenuItem key={index} value={studio?.id || ""}>
                                {studio?.studioName} - {studioAddress}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      {formData.venueDetails?.studio && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="success.main">
                            ✓ Studio details loaded below
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                  )}

                  {/* Show studio details when studio is selected */}
                  {formData.venueType === "Studio" && formData.venueDetails?.studio && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: "16px",
                            color: "black",
                          }}
                          gutterBottom
                        >
                          Building Name
                        </Typography>
                        <TextField
                          fullWidth
                          name="building"
                          sx={{ height: FORM_FIELD_HEIGHT }}
                          variant="outlined"
                          InputLabelProps={{ shrink: false }}
                          placeholder="Building name from selected studio"
                          value={formData.building}
                          disabled={true}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: "16px",
                            color: "black",
                          }}
                          gutterBottom
                        >
                          Street Address
                        </Typography>
                        <TextField
                          fullWidth
                          name="street"
                          sx={{ height: FORM_FIELD_HEIGHT }}
                          variant="outlined"
                          InputLabelProps={{ shrink: false }}
                          placeholder="Street address from selected studio"
                          value={formData.street}
                          disabled={true}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: "16px",
                            color: "black",
                          }}
                          gutterBottom
                        >
                          City
                        </Typography>
                        <TextField
                          fullWidth
                          name="city"
                          sx={{ height: FORM_FIELD_HEIGHT }}
                          variant="outlined"
                          InputLabelProps={{ shrink: false }}
                          placeholder="City from selected studio"
                          value={formData.city}
                          disabled={true}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: "16px",
                            color: "black",
                          }}
                          gutterBottom
                        >
                          State
                        </Typography>
                        <TextField
                          fullWidth
                          name="state"
                          sx={{ height: FORM_FIELD_HEIGHT }}
                          variant="outlined"
                          InputLabelProps={{ shrink: false }}
                          placeholder="State from selected studio"
                          value={formData.state}
                          disabled={true}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: "16px",
                            color: "black",
                          }}
                          gutterBottom
                        >
                          Pincode
                        </Typography>
                        <TextField
                          fullWidth
                          name="pincode"
                          sx={{ height: FORM_FIELD_HEIGHT }}
                          variant="outlined"
                          InputLabelProps={{ shrink: false }}
                          placeholder="Pincode from selected studio"
                          value={formData.pincode}
                          disabled={true}
                        />
                      </Grid>
                      {formData.geolocation && formData.geolocation.lat && formData.geolocation.lng && (
                        <Grid item xs={12}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontSize: "16px",
                              color: "black",
                            }}
                            gutterBottom
                          >
                            Geolocation (Lat, Lng)
                          </Typography>
                          <TextField
                            fullWidth
                            sx={{ height: FORM_FIELD_HEIGHT }}
                            variant="outlined"
                            InputLabelProps={{ shrink: false }}
                            placeholder="Geolocation from selected studio"
                            value={`${formData.geolocation.lat}, ${formData.geolocation.lng}`}
                            disabled={true}
                          />
                        </Grid>
                      )}
                    </>
                  )}

                  {formData.venueType === "Independent" && (
                    <>
                      <Grid item xs={12}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: "16px",
                            color: "black",
                          }}
                          gutterBottom
                        >
                          Street Address
                        </Typography>
                        <TextField
                          fullWidth
                          name="streetAddress"
                          value={formData.venueDetails?.streetAddress || ""}
                          onChange={handleIndependentVenueChange}
                          sx={{ height: FORM_FIELD_HEIGHT }}
                          variant="outlined"
                          InputLabelProps={{ shrink: false }}
                          placeholder="Enter street address"
                          disabled={!isCreatorEmailValid}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="body1"
                          sx={{ fontSize: "16px" }}
                          gutterBottom
                        >
                          Building/Landmark
                        </Typography>
                        <TextField
                          fullWidth
                          name="buildingName"
                          value={formData.venueDetails?.buildingName || ""}
                          onChange={handleIndependentVenueChange}
                          sx={{ height: FORM_FIELD_HEIGHT }}
                          variant="outlined"
                          InputLabelProps={{ shrink: false }}
                          placeholder="Enter building name"
                          disabled={!isCreatorEmailValid}
                        />
                      </Grid>
                    </>
                  )}

                  {formData.venueType === "Independent" && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: "16px",
                            color: "black",
                          }}
                          gutterBottom
                        >
                          City
                        </Typography>
                        <FormControl fullWidth>
                          <Select
                            name="city"
                            value={formData.venueDetails?.city || ""}
                            onChange={handleIndependentVenueChange}
                            displayEmpty
                            disabled={!isCreatorEmailValid}
                            sx={{ height: FORM_FIELD_HEIGHT }}
                          >
                            <MenuItem value="">Select city</MenuItem>
                            {cityOptions.map((city, index) => (
                              <MenuItem key={index} value={city}>
                                {city}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: "16px",
                            color: "black",
                          }}
                          gutterBottom
                        >
                          State
                        </Typography>
                        <FormControl fullWidth>
                          <Select
                            name="state"
                            value={formData.venueDetails?.state || ""}
                            onChange={handleIndependentVenueChange}
                            displayEmpty
                            disabled={!isCreatorEmailValid}
                            sx={{ height: FORM_FIELD_HEIGHT }}
                          >
                            <MenuItem value="">Select state</MenuItem>
                            {stateOptions.map((state, index) => (
                              <MenuItem key={index} value={state}>
                                {state}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12} sm={4}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "16px",
                        color: "black",
                      }}
                      gutterBottom
                    >
                      Pincode
                    </Typography>
                    <TextField
                      fullWidth
                      name="pincode"
                      sx={{ height: FORM_FIELD_HEIGHT }}
                      variant="outlined"
                      InputLabelProps={{ shrink: false }}
                      placeholder="Enter pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "16px",
                        color: "black",
                      }}
                      gutterBottom
                    >
                      Google Maps Address
                    </Typography>
                    <TextField
                      fullWidth
                      name="mapAddress"
                      sx={{ height: FORM_FIELD_HEIGHT }}
                      variant="outlined"
                      InputLabelProps={{ shrink: false }}
                      placeholder="Enter Google Maps address"
                      value={formData.mapAddress}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sx={{ textAlign: "right" }}>
                    <MuiButton
                      variant="contained"
                      type="submit"
                      disabled={isSubmitting}
                      sx={{
                        bgcolor: "#67569E",
                        color: "white",
                        textTransform: "capitalize",
                        "&:hover": { bgcolor: "#67569E", color: "white" },
                      }}
                    >
                      Next
                    </MuiButton>
                  </Grid>
                </Grid>
              </Form>
            )}

            {step === 2 && (
              <WorkshopStep2EventInfo
                onBack={() => setStep((prev) => prev - 1)}
                onSubmit={handleAddWorkshop}
                formData={formData}
                setFormData={setFormData}
              />
            )}
          </Paper>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default WorkshopForm;
