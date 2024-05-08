import React, { useState } from 'react';
import { getListFromDiffCollectionUsingEmail } from '../utils/firebaseUtils';
import { Card, CardContent, Typography, TextField, Button, Select, MenuItem, Grid } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function Bookings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Email');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      if (!searchQuery.trim()) return; // Do not search if query is empty or contains only whitespace

      const data = await getListFromDiffCollectionUsingEmail(searchQuery.trim(), 'Transactions','userId');
      setSearchResults(data ? data : []); // If data is found, put it in an array, otherwise empty array
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setSearchResults([]);
    }
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          style={{ marginRight: '8px',flex: 1  }}
        />
        <Select
          value={selectedFilter}
          onChange={handleFilterChange}
          style={{ marginRight: '8px' }}
        >
          <MenuItem value="Email">Email User</MenuItem>
        </Select>
        <Button variant="contained" onClick={handleSearch}>Search</Button>
      </div>
      
      <div>
      {searchResults.length > 0 ? (
        <Grid container spacing={2}>
          {searchResults.map(result => (
            <Grid item key={result.id} xs={12} sm={6} md={4} lg={3}>
            <Card style={{ marginBottom: '16px' }}>
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableBody>
                      {Object.entries(result).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell component="th" scope="row">
                            {key}
                          </TableCell>
                          <TableCell align="left">
                            {value !== null && value !== undefined ? value.toString() : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
            </Grid>
          
          ))}
        </Grid>
      ) : (
        <Typography variant="body1">
          No results found.
        </Typography>
      )}
    </div>


    </div>
  );
}

export default Bookings;
