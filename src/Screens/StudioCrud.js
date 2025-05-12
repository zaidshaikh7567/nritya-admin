import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  FormControl, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  TextField, 
  Button, 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Paper 
} from '@mui/material';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


// Mode URLs
const server = {
  "PRODUCTION": "https://djserver-production-ffe37b1b53b5.herokuapp.com/",
  "STAGING": "https://nrityaserver-2b241e0a97e5.herokuapp.com/"
};

const render = {
  "PRODUCTION": "https://www.nritya.co.in/",
  "STAGING": "https://nritya-official.github.io/nritya-webApp/"
};

function StudioCrud() {
  const [mode, setMode] = useState("STAGING");
  const [searchType, setSearchType] = useState("EMAIL");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [submitting, setSubmitting] =useState(false)
  const [selectedStudio, setSelectedStudio] = useState(null);
  const baseUrlServer = server[mode];
  const baseUrlRender = render[mode];
  

  const handleSearch = async () => {
    let searchUrl = `${baseUrlServer}crud/listStudiosWithFilters/`;

    if (searchType === "EMAIL") {
      searchUrl += `?creatorEmail=${searchQuery}`;
    } else if (searchType === "CITY") {
      searchUrl += `?city=${searchQuery}`;
    }

    console.log("Search URL:", searchUrl);

    try {
      setSubmitting(true)
      setResults([])
      const response = await axios.get(searchUrl);
      setResults(response.data.data || []); // assuming response.data.data holds the array
    } catch (error) {
      console.error("Error fetching studios:", error);
      setResults([]);
    } finally{
      setSubmitting(false)
    }
  };

  const pushData = async (id, entityType) => {
    try {
      const updatedData = {
        studioName: selectedStudio.studioName,
        creatorEmail: selectedStudio.creatorEmail,
        city: selectedStudio.city,
        founderName: selectedStudio.founderName,
        aboutFounder: selectedStudio.aboutFounder,
        status: selectedStudio.status,
        mobileNumber: selectedStudio.mobileNumber,
        street: selectedStudio.street,
        danceStyles: selectedStudio.danceStyles,
        addAmenities: selectedStudio.addAmenities,
        maximumOccupancy: selectedStudio.maximumOccupancy,
        aboutStudio: selectedStudio.aboutStudio,
        // optionally any other fields you want to push
      };
      const response = await fetch(`${baseUrlServer}n_admin/push_data/${id}/${entityType}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("Data pushed successfully:", data);
        alert("Studio details updated successfully!");
      } else {
        console.error("Error pushing data:", data);
        alert("Failed to update. Check console for details.");
      }
    } catch (error) {
      console.error("Push Error:", error);
      alert("Network error. Please try again.");
    }
  };
  

  return (
    <>
    <Box sx={{ p: 4, maxWidth: "100", margin: 'auto', fontFamily: 'sans-serif' }}>
      <Typography variant="h5" gutterBottom>
        Studio CRUD
      </Typography>

      {/* Mode Select */}
      <FormControl component="fieldset">
        <RadioGroup row value={mode} onChange={(e) => setMode(e.target.value)}>
          <FormControlLabel value="STAGING" control={<Radio />} label="Staging" />
          <FormControlLabel value="PRODUCTION" control={<Radio />} label="Production" />
        </RadioGroup>
      </FormControl>

      <br />

      {/* Search Type */}
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <RadioGroup row value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <FormControlLabel value="EMAIL" control={<Radio />} label="Search by Email" />
          <FormControlLabel value="CITY" control={<Radio />} label="Search by City" />
        </RadioGroup>
      </FormControl>

      {/* Search Input */}
      <TextField
        label={`Enter ${searchType}`}
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Button variant="contained" color="primary" disabled={submitting} onClick={handleSearch} fullWidth>
        {submitting ? "Searching...":"Search"}
      </Button>

      {results.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell><b>Studio ID</b></TableCell>
                <TableCell><b>Studio Name</b></TableCell>
                <TableCell><b>Creator Email</b></TableCell>
                <TableCell><b>City</b></TableCell>
                <TableCell><b>Founder Name</b></TableCell>
                <TableCell><b>Status</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((studio, index) => (
                <TableRow key={index} onClick={() => setSelectedStudio(studio)} sx={{ cursor: 'pointer' }}>
                 <TableCell>
                  <a
                    href={`${baseUrlRender}#/studio/${studio.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {studio.id}
                  </a>
                </TableCell>

                  <TableCell>{studio.studioName}</TableCell>
                  <TableCell>{studio.creatorEmail}</TableCell>
                  <TableCell>{studio.city}</TableCell>
                  <TableCell>{studio.founderName}</TableCell>
                  <TableCell>{studio.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
      )}
    </Box>
    <Dialog open={Boolean(selectedStudio)} onClose={() => setSelectedStudio(null)} maxWidth="100%" fullWidth>
  <DialogTitle>
    {selectedStudio?.studioName}
    <IconButton
      aria-label="close"
      onClick={() => setSelectedStudio(null)}
      sx={{ position: 'absolute', right: 8, top: 8 }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  <DialogContent dividers>

    {/* Studio basic info */}
    {selectedStudio && (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>Edit Studio Details</Typography>
    
    <TextField
      label="Studio Name"
      value={selectedStudio.studioName || ""}
      onChange={(e) =>
        setSelectedStudio({ ...selectedStudio, studioName: e.target.value })
      }
      fullWidth
      margin="normal"
    />

    <TextField
      label="Creator Email"
      value={selectedStudio.creatorEmail || ""}
      onChange={(e) =>
        setSelectedStudio({ ...selectedStudio, creatorEmail: e.target.value })
      }
      fullWidth
      margin="normal"
    />

    <TextField
      label="City"
      value={selectedStudio.city || ""}
      onChange={(e) =>
        setSelectedStudio({ ...selectedStudio, city: e.target.value })
      }
      fullWidth
      margin="normal"
    />

    <TextField
      label="Founder Name"
      value={selectedStudio.founderName || ""}
      onChange={(e) =>
        setSelectedStudio({ ...selectedStudio, founderName: e.target.value })
      }
      fullWidth
      margin="normal"
    />

    <TextField
      label="Status"
      value={selectedStudio.status || ""}
      onChange={(e) =>
        setSelectedStudio({ ...selectedStudio, status: e.target.value })
      }
      fullWidth
      margin="normal"
    />

    <TextField
      label="Mobile Number"
      value={selectedStudio.mobileNumber || ""}
      onChange={(e) =>
        setSelectedStudio({ ...selectedStudio, mobileNumber: e.target.value })
      }
      fullWidth
      margin="normal"
    />

    <TextField
      label="Street"
      value={selectedStudio.street || ""}
      onChange={(e) =>
        setSelectedStudio({ ...selectedStudio, street: e.target.value })
      }
      fullWidth
      margin="normal"
    />

    <TextField
      label="Dance Styles"
      value={Array.isArray(selectedStudio.danceStyles)
        ? selectedStudio.danceStyles.join(", ")
        : selectedStudio.danceStyles || ""}
      
      onChange={(e) =>
        setSelectedStudio({
          ...selectedStudio,
          danceStyles: e.target.value.split(",").map((item) => item.trim()),
        })
      }
      fullWidth
      margin="normal"
    />

    <TextField
      label="Amenities"
      value={Array.isArray(selectedStudio.addAmenities)
        ? selectedStudio.addAmenities.join(", ")
        : selectedStudio.addAmenities || ""}
      
      onChange={(e) =>
        setSelectedStudio({
          ...selectedStudio,
          addAmenities: e.target.value.split(",").map((item) => item.trim()),
        })
      }
      fullWidth
      margin="normal"
    />

    <TextField
      label="Maximum Occupancy"
      type="number"
      value={selectedStudio.maximumOccupancy || ""}
      onChange={(e) =>
        setSelectedStudio({
          ...selectedStudio,
          maximumOccupancy: e.target.value,
        })
      }
      fullWidth
      margin="normal"
    />

    <TextField
      label="About Studio"
      multiline
      minRows={3}
      value={selectedStudio.aboutStudio || ""}
      onChange={(e) =>
        setSelectedStudio({
          ...selectedStudio,
          aboutStudio: e.target.value,
        })
      }
      fullWidth
      margin="normal"
    />

  <TextField
        label="About Founder"
        multiline
        minRows={3}
        value={selectedStudio.aboutFounder || ""}
        onChange={(e) =>
          setSelectedStudio({
            ...selectedStudio,
            aboutFounder: e.target.value,
          })
        }
        fullWidth
        margin="normal"
      />

    <Button
      variant="contained"
      color="primary"
      sx={{ mt: 2 }}
      onClick={() => pushData(selectedStudio.id, "Studio")}
    >
      Save Changes
    </Button>
  </Box>
)}


    {/* Class Schedule Table */}
    {selectedStudio?.tableData && (
  <>
    <Typography variant="h6" gutterBottom>Classes (Edit)</Typography>
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><b>Class Name</b></TableCell>
            <TableCell><b>Dance Form</b></TableCell>
            <TableCell><b>Days</b></TableCell>
            <TableCell><b>Time</b></TableCell>
            <TableCell><b>Fee</b></TableCell>
            <TableCell><b>Free Trial</b></TableCell>
            <TableCell><b>Category</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(selectedStudio.tableData).map(([key, classItem]) => (
            <TableRow key={key}>
              <TableCell>
                <TextField
                  value={classItem.className}
                  onChange={(e) => {
                    const updatedTableData = { ...selectedStudio.tableData };
                    updatedTableData[key].className = e.target.value;
                    setSelectedStudio({ ...selectedStudio, tableData: updatedTableData });
                  }}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={classItem.danceForms}
                  onChange={(e) => {
                    const updatedTableData = { ...selectedStudio.tableData };
                    updatedTableData[key].danceForms = e.target.value;
                    setSelectedStudio({ ...selectedStudio, tableData: updatedTableData });
                  }}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={classItem.days}
                  onChange={(e) => {
                    const updatedTableData = { ...selectedStudio.tableData };
                    updatedTableData[key].days = e.target.value;
                    setSelectedStudio({ ...selectedStudio, tableData: updatedTableData });
                  }}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={classItem.time}
                  onChange={(e) => {
                    const updatedTableData = { ...selectedStudio.tableData };
                    updatedTableData[key].time = e.target.value;
                    setSelectedStudio({ ...selectedStudio, tableData: updatedTableData });
                  }}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={classItem.fee}
                  onChange={(e) => {
                    const updatedTableData = { ...selectedStudio.tableData };
                    updatedTableData[key].fee = e.target.value;
                    setSelectedStudio({ ...selectedStudio, tableData: updatedTableData });
                  }}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={classItem.freeTrial}
                  onChange={(e) => {
                    const updatedTableData = { ...selectedStudio.tableData };
                    updatedTableData[key].freeTrial = e.target.value;
                    setSelectedStudio({ ...selectedStudio, tableData: updatedTableData });
                  }}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={(classItem.classCategory || []).join(', ')}
                  onChange={(e) => {
                    const updatedTableData = { ...selectedStudio.tableData };
                    updatedTableData[key].classCategory = e.target.value.split(',').map(cat => cat.trim());
                    setSelectedStudio({ ...selectedStudio, tableData: updatedTableData });
                  }}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Button
      variant="contained"
      color="primary"
      sx={{ mt: 2 }}
      onClick={() => pushData(selectedStudio.id, "Studio")}
    >
      Save Changes
    </Button>
  </>
)}


  </DialogContent>
</Dialog>

    </>
  );
}

export default StudioCrud;
