import React, { useState } from 'react';
import { getUserByEmail, saveDocument } from '../utils/firebaseUtils';
import { Card, CardContent, Button, TextField, Switch } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function Users() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearchByEmail = async () => {
    try {
      setLoading(true);
      const userData = await getUserByEmail(email);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleIsCreator = async (userId, newValue) => {
    try {
      setLoading(true);
      const updatedUser = { ...user, CreatorMode: newValue }; // Update CreatorMode field
      await saveDocument('User', userId, updatedUser); // Save updated user data
      setUser(updatedUser); // Update user state with the new data
      handleSearchByEmail(email);
    } catch (error) {
      console.error('Error updating CreatorMode:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <br />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          type="text"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ flex: 1, '& .MuiInputBase-root': { height: '100%' } }} 
        />
        <Button
          variant="contained"
          onClick={handleSearchByEmail}
          disabled={loading}
          sx={{ height: '100%' }}
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {user && (
        <Card style={{ marginBottom: '16px',minWidth:'30rem',flexWrap:'nowrap',display:'flex' }}>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Field</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(user)
                    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                    .map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell>{key}</TableCell>
                        <TableCell>
                          {
                          key === "CreatorMode"?(
                            <Switch
                            checked={user.CreatorMode?true:false}
                            onChange={() => handleToggleIsCreator(user.UserId, !user.CreatorMode)}
                            inputProps={{ 'aria-label': 'controlled' }}
                            />
                          )
                          :
                          (typeof value === 'boolean' ? value.toString() :
                            typeof value === 'object' && value !== null && !Array.isArray(value) ? (
                              Object.entries(value).map(([subKey, subValue]) => (
                                <div key={subKey}>
                                  <strong>{subKey}:</strong> {subValue}
                                </div>
                              ))
                            ) : Array.isArray(value) ? (
                              
                              JSON.stringify(value)
                            ) : (
                              value
                            ))}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              
            </TableContainer>
          </CardContent>

          
        </Card>
      )}
    </div>
  );
}

export default Users;
