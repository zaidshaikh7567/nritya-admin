import React, { useState, useEffect } from 'react';
import { deleteDocument, getAllDocument, saveDocument } from '../utils/firebaseUtils';
import { Table, TableHead, TableBody, TableRow, TableCell, Button,Select, MenuItem, DialogContent, DialogTitle, Dialog, DialogActions, Grid, TextField,Tab,Box } from '@mui/material';
import {  AddCircleRounded } from '@mui/icons-material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

function AdminMgmt() {
    const [adminData, setAdminData] = useState([]);
    const [deleteAdminId, setDeleteAdminId] = useState(null); 
    const [newAdminsData, setNewAdminsData] = useState([{ id: '', role: '1' }]);
    const [batchAddition, setBatchAddition] = useState([]);
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    let reolad = 1
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllDocument("Admin");
                setAdminData(result);
            } catch (error) {
                console.error("Error fetching admin data:", error);
            }
        };
        fetchData();
    }, [reolad]);

    const handleRoleChange = (event, adminId) => {
        const newRole = event.target.value;
        setAdminData(prevAdminData => {
            return prevAdminData.map(admin => {
                if (admin.id === adminId) {
                    return { ...admin, role: newRole };
                } else {
                    return admin;
                }
            });
        })
    };

    const handleUpdate = (adminId) => {
        const adminDetails = adminData.find(admin => admin.id === adminId);
        if (adminDetails) {
            console.log("Admin details:", adminDetails);
            const data = saveDocument("Admin",adminId,{"role":adminDetails.role})
            if(data){
                alert("Admin Role updated")
            }
        } else {
            console.error("Admin not found with ID:", adminId);
        }
    };
    
    const handleBatchInputChange = (event) => {
      const inputValue = event.target.value;
      const emailsArray = inputValue
          .split(',')
          .map(email => email.trim());
      setBatchAddition(emailsArray);
  };
  


    const handleDelete = (adminId) => {
      setDeleteAdminId(adminId); 
    };

    const handleConfirmDelete = () => {
        console.log("Delete admin with ID:", deleteAdminId);
        const result = deleteDocument("Admin", deleteAdminId)
        if (result) {
            const updatedAdminData = adminData.filter(admin => admin.id !== deleteAdminId);
            setAdminData(updatedAdminData);
        }
        setDeleteAdminId(null); 
    };

    const handleCloseDialog = () => {
        setDeleteAdminId(null); 
    };


      const addRow = () => {
       
        const hasEmptyId = newAdminsData.some(admin => admin.id === '');
        
        if (hasEmptyId) {
            alert("Fill Previous rows before adding new.")
            return;
        }
        setNewAdminsData([...newAdminsData, { id: '', role: '1' }]);
      };

      const addRowsBatch = () => {
        if (!Array.isArray(batchAddition) || batchAddition.length === 0) {
            return;
        }
        const uniqueEmails = [...new Set(batchAddition.filter(email => email.trim() !== ''))];
    
        const uniqueAdmins = uniqueEmails.filter((email, index, self) => (
            index === self.findIndex(e => e === email)
        ));
    
        uniqueAdmins.forEach(email => {
            setNewAdminsData(prevAdminsData => [
                ...prevAdminsData,
                { id: email, role: '2' }
            ]);
        });
    };
    
    
    
    
      const removeRow = (index) => {
        const updatedAdmins = [...newAdminsData];
        updatedAdmins.splice(index, 1);
        setNewAdminsData(updatedAdmins);
      };
    
      const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const updatedAdmins = [...newAdminsData];
        updatedAdmins[index][name] = value;
        setNewAdminsData(updatedAdmins);
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        const filteredAdminsData = newAdminsData.filter(admin => admin.id !== '' && admin.role !== '');
        const uniqueNewAdminsData = filteredAdminsData.filter((admin, index) => (
          index === filteredAdminsData.findIndex(a => a.id === admin.id)
        ));
        // Deduplicate against adminData based on id
        const uniqueAdminsData = uniqueNewAdminsData.filter(newAdmin => (
            !adminData.some(existingAdmin => existingAdmin.id === newAdmin.id)
        ));
        let count = 0
        for (const admin of uniqueAdminsData) {
            const { id, role } = admin;
            try {
              await saveDocument("Admin", id, { "role": role });
              console.log(`Admin with id ${id} updated successfully with role ${role}`);
              count = count + 1
            } catch (error) {
              console.error(`Error updating admin with id ${id}:`, error);
            }
          }
          alert(`${count} new unique admin(s) updated`)
          window.location.reload();
        
          setNewAdminsData([{ id: '', role: '' }])
        
      
        console.log('Admin data:', uniqueAdminsData);
      };
    
    
    
    

    return (
        <div>
          <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Admin List" value="1" />
            <Tab label="Add new admin" value="2" />
          </TabList>
        </Box>
          <TabPanel value="1">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
            <h1>Admin Management</h1>
            <Table>
                <TableHead>
                    <TableRow sx={{background:"black"}}>
                        <TableCell sx={{ width: "50%",color:"white" }} >ID</TableCell>
                        <TableCell sx={{ width: "20%",color:"white" }} >Role</TableCell>
                        <TableCell sx={{color:"white"}}>Update</TableCell>
                        <TableCell sx={{color:"white"}}>Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {adminData.map((admin) => (
                        <TableRow key={admin.id} >
                            <TableCell sx={{ width: "50%" }}>{admin.id}</TableCell>
                            <TableCell sx={{ width: "20%" }}>
                                <Select
                                    value={admin.role}
                                    onChange={(event) => handleRoleChange(event, admin.id)}
                                    style={{height:"2.5rem",width:"10rem"}}
                                    
                                >
                                    <MenuItem value={1}>Super Admin</MenuItem>
                                    <MenuItem value={2}>Admin</MenuItem>
                                    <MenuItem value={3}>Deputy Admin</MenuItem>
                                    <MenuItem value={4}>Assistant Admin</MenuItem>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Button variant="contained" color="primary" onClick={() => handleUpdate(admin.id)}>Update</Button>
                            </TableCell>
                            <TableCell>
                                <Button variant="contained" color="error" onClick={() => handleDelete(admin.id)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </div>

          </TabPanel>
          <TabPanel value="2">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
            <h1>Add Admins</h1>
            <AddCircleRounded style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={addRow} />
            </div>

            <div style={{  flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
              <form onSubmit={handleSubmit}>
                <Table>
                  <TableHead>
                    <TableRow sx={{background:"black"}}>
                      <TableCell sx={{ width: "50%", color:'white' }}>Email Id</TableCell>
                      <TableCell sx={{ width: "20%",color:'white' }}>Role</TableCell>
                      <TableCell sx={{color:'white'}}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {newAdminsData.map((admin, index) => (
                      <TableRow key={index} sx={{ width: "50%" }}>
                        <TableCell>
                          <input
                            type="email"
                            name="id"
                            value={admin.id}
                            onChange={(e) => handleInputChange(e, index)}
                            style={{height:"2rem"}}
                          />
                        </TableCell>
                        <TableCell sx={{ width: "20%" }}>
                          <Select
                            value={admin.role}
                            onChange={(e) => handleInputChange(e, index)}
                            name="role"
                            style={{height:"3rem"}}
                          >
                            <MenuItem value={1}>Super Admin</MenuItem>
                            <MenuItem value={2}>Admin</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {index > 0 && (
                            <Button variant="contained" color="error" onClick={() => removeRow(index)}>Remove</Button>
                          )}
                          {index === 0 && (
                            <Button disabled variant="contained" color="error" onClick={() => removeRow(index)}>Remove</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                  <Button variant="contained" type="submit">Submit</Button>
                </div>
              </form>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                <h1>Add in batch</h1>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={11}>
                      <TextField
                          fullWidth
                          label="Enter text"
                          variant="outlined"
                          value={batchAddition}
                          onChange={handleBatchInputChange}
                      />
                  </Grid>
                  <Grid item xs={1}>
                      <Button variant="contained" onClick={addRowsBatch}>Submit</Button>
                  </Grid>
                </Grid>
              </div>
              <br></br>
            </div>

          </TabPanel>
      </TabContext>
    </Box>
          

            <Dialog open={deleteAdminId !== null} onClose={handleCloseDialog}>
                <DialogTitle>Delete {deleteAdminId} ?</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete this admin?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>


        </div>
    );
}

export default AdminMgmt;
