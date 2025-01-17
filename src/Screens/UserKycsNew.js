import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Box,
} from "@mui/material";
import { Form } from "react-bootstrap";
import { Alert } from "@mui/lab";

const statusFlags = [
  "Submitted",
  "Verified",
  "Under Review",
  "Reviewed",
  "Verification Failed",
];
const names_map = new Map([
  ["first_name", "First Name"],
  ["middle_last_name", "Middle & Last Name"],
  ["phone_number", "Phone Number"],
  ["street_address", "Street Address"],
  ["city", "City"],
  ["state_province", "State"],
  ["state", "State"],
  ["zip_pin_code", "PIN Code/ZIP"],
  ["aadhar", "Aadhar Number"],
  ["gstin", "Gst Number"],
  ["comments", "Remark(s)"],
  ["UserId", "UserId"],
  ["id", "KYC ID"],
  ["status", "Status"],
  ["country", "Country"],
  ["hash", "Hash"],
]);

const modes = {
  staging: {
    baseURL: "https://nrityaserver-2b241e0a97e5.herokuapp.com",
  },
  production: {
    baseURL: "https://djserver-production-ffe37b1b53b5.herokuapp.com",
  },
};

const modesList = Object.keys(modes);

function UserKycsNew() {
  const [kycData, setKycData] = useState({});
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [docUrls, setDocUrls] = useState({});
  const [runMode, setRunMode] = useState(modesList[0]);

  useEffect(() => {
    fetch(`${modes[runMode].baseURL}/crud/getKyc/`)
      .then((res) => res.json())
      .then((data) => setKycData(data.data))
      .catch((err) => console.error("Error fetching KYC data:", err));
  }, [runMode]);

  const handleChange = (field, value) => {
    if (!selectedKyc) return;

    setSelectedKyc((prevKyc) => ({
      ...prevKyc,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (!selectedKyc) return;

    const { id } = selectedKyc;
    console.log(docUrls);

    if (docUrls[id] && (docUrls[id].aadhar || docUrls[id].gst)) {
      return;
    }

    const docUrl = `${modes[runMode].baseURL}/${
      runMode === modes[0] ? "crud/getKycDoc" : "crud/getKyc"
    }/${id}`;

    fetch(docUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDocUrls((prev) => ({
            ...prev,
            [id]: {
              aadhar: data.data.Aadhar || "",
              gst: data.data.Gst || "",
            },
          }));
        }
      })
      .catch((err) => {
        console.error("Error fetching document URLs:", err);
      });
  }, [selectedKyc]);

  const handleSubmit = () => {
    if (!selectedKyc) {
      setErrorMsg("No KYC record selected.");
      return;
    }
    console.log(selectedKyc);
    const { id, status, comments } = selectedKyc;

    setStatusLoading(true);
    setErrorMsg("");

    const requestData = {
      data: {
        status,
        comments,
      },
    };

    fetch(`${modes[runMode].baseURL}/crud/kycApproval/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update KYC record.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        // Update KYC data in the state
        setKycData((prevData) => {
          const updatedData = { ...prevData };

          // Loop over all statuses and remove the entry from all of them
          Object.keys(updatedData).forEach((statusKey) => {
            if (updatedData[statusKey]?.data?.[selectedKyc.id]) {
              // Decrease count of the old status if the entry exists
              updatedData[statusKey].count = Math.max(
                0,
                updatedData[statusKey].count - 1
              );
              delete updatedData[statusKey].data[selectedKyc.id];
            }
          });

          // Ensure the new status exists and initialize data and count if not present
          if (!updatedData[status]) {
            updatedData[status] = { data: {}, count: 0 }; // Initialize if the status doesn't exist
          }

          // Add the new entry to the new status
          updatedData[status].data[selectedKyc.id] = {
            ...selectedKyc,
            status: status,
            comments: comments,
          };

          // Increase the count of the new status
          updatedData[status].count = updatedData[status].count + 1;

          return updatedData;
        });

        console.log(kycData);
        setStatusLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMsg("An error occurred while updating the KYC record.");
        setStatusLoading(false);
      });
  };

  const downloadDoc = (docType, id) => {
    const url = docUrls[id]?.[docType];
    if (url) {
      window.open(url, "_blank");
    } else {
      alert(`${docType} document is not available.`);
    }
  };

  const handleRunModeChange = (event, newRunMode) => {
    if (newRunMode !== null) {
      setRunMode(newRunMode);
      setKycData({});
      setSelectedKyc(null);
      setStatusLoading(false);
      setErrorMsg("");
      setDocUrls({});
    }
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {/* Top Cards */}
      <Grid item>
        <ToggleButtonGroup
          exclusive
          color="primary"
          value={runMode}
          onChange={handleRunModeChange}
        >
          {modesList.map((mode, index) => (
            <ToggleButton
              key={index}
              value={mode}
              sx={{ textTransform: "capitalize" }}
            >
              {mode}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Grid>

      <Grid item xs={12} container spacing={2}>
        {kycData &&
          Object.keys(kycData).map((status) => (
            <Grid item xs={12} sm={6} md={2} key={status}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{status}</Typography>
                  <Typography variant="h4">
                    {kycData[status]?.count || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      {/* Main Layout */}
      <Grid item xs={12} container spacing={2}>
        {/* Table (Left Panel) */}
        <Grid item xs={5}>
          <TableContainer
            sx={{ borderRadius: 2, border: 1 }}
            className="hidden-scrollbar"
          >
            <Table
              stickyHeader
              sx={{
                borderCollapse: "collapse",
                borderStyle: "hidden",
                "& td": {
                  border: 1,
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      minWidth: "150px",
                      border: "1px solid black",
                      borderRadius: 2,
                      borderCollapse: "collapse",
                    }}
                  >
                    ID
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: "150px",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                      borderTop: "1px solid black",
                    }}
                  >
                    First Name
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: "150px",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                      borderTop: "1px solid black",
                    }}
                  >
                    City
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: "150px",
                      borderBottom: "1px solid black",
                      borderRight: "1px solid black",
                      borderTop: "1px solid black",
                    }}
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {kycData &&
                  Object.keys(kycData).map((status) =>
                    Object.keys(kycData[status]?.data || {}).map((id) => {
                      const kyc = kycData[status].data[id];
                      return (
                        <TableRow
                          hover
                          key={id}
                          role="checkbox"
                          tabIndex={-1}
                          onClick={() => setSelectedKyc({ ...kyc, id, status })}
                          style={{ cursor: "pointer" }}
                          sx={{
                            bgcolor:
                              selectedKyc?.id === id
                                ? "rgba(224, 224, 224, 1)"
                                : "white",
                            "&:hover": {
                              bgcolor: "rgba(224, 224, 224, 1) !important",
                            },
                          }}
                        >
                          <TableCell
                            sx={{
                              borderBottom: "1px solid black",
                              borderRight: "1px solid black",
                            }}
                          >
                            {id}
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottom: "1px solid black",
                              borderRight: "1px solid black",
                            }}
                          >
                            {kyc.first_name}
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottom: "1px solid black",
                              borderRight: "1px solid black",
                            }}
                          >
                            {kyc.city}
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottom: "1px solid black",
                              borderRight: "1px solid black",
                            }}
                          >
                            {kyc.status}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Detailed View (Right Panel) */}
        <Grid item xs={7}>
          {selectedKyc ? (
            <Card
              variant="outlined"
              style={{
                backgroundColor: "black",
                color: "#fff",
                borderRadius: 8,
              }}
            >
              <CardContent>
                <Grid container spacing={2}>
                  {Array.from(names_map.keys())
                    .filter(
                      (key) =>
                        key !== "status" &&
                        key !== "hash" &&
                        key !== "country" &&
                        key !== "comments" &&
                        selectedKyc[key] !== undefined
                    )
                    .map((key) => (
                      <Grid item xs={6} key={key}>
                        <Typography style={{ color: "#fff" }}>
                          <strong>{names_map.get(key)}:</strong>{" "}
                          {selectedKyc[key]}
                        </Typography>
                      </Grid>
                    ))}
                </Grid>
                <div style={{ marginTop: "20px" }}>
                  <Form.Control
                    type="text"
                    placeholder="Add Comment"
                    value={selectedKyc.comments || ""}
                    onChange={(e) => handleChange("comments", e.target.value)}
                    as="textarea"
                    style={{
                      padding: 8,
                      width: "100%",
                      height: "auto",
                      backgroundColor: "#444", // Dark background for text area
                      color: "#fff", // Light text
                      borderColor: "#666", // Border color
                    }}
                    rows={4}
                  />

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Form.Select
                      value={selectedKyc.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                      style={{
                        padding: 12,
                        backgroundColor: "#444", // Dark background for select
                        color: "#fff", // Light text
                        borderColor: "#666", // Border color
                      }}
                    >
                      {statusFlags.map((flag) => (
                        <option key={flag} value={flag}>
                          {flag}
                        </option>
                      ))}
                    </Form.Select>

                    <Button
                      variant="contained"
                      disabled={statusLoading}
                      onClick={handleSubmit}
                      style={{
                        marginTop: "10px",
                        backgroundColor: "#6200ea", // Dark button with purple accent
                        color: "#fff",
                      }}
                    >
                      {statusLoading ? "Submitting..." : "Submit Changes"}
                    </Button>
                  </Box>
                </div>
                <div style={{ marginTop: "10px" }}>
                  <Button
                    variant="contained"
                    disabled={
                      !docUrls[selectedKyc.id] ||
                      !docUrls[selectedKyc.id].aadhar
                    } // Disable if Aadhar URL is not available
                    onClick={() => downloadDoc("aadhar", selectedKyc.id)}
                    style={{
                      marginRight: "10px",
                      backgroundColor: "#4caf50", // Green for Aadhar
                      color: "#fff",
                    }}
                  >
                    Download Aadhar
                  </Button>
                  <Button
                    variant="contained"
                    disabled={
                      !docUrls[selectedKyc.id] || !docUrls[selectedKyc.id].gst
                    } // Disable if Gst URL is not available
                    onClick={() => downloadDoc("gst", selectedKyc.id)}
                    style={{
                      marginLeft: "10px",
                      backgroundColor: "#f44336", // Red for Gst
                      color: "#fff",
                    }}
                  >
                    Download Gst
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Typography style={{ color: "#fff" }}>
              Select a KYC record to view details.
            </Typography>
          )}
          {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default UserKycsNew;
