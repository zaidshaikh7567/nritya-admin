import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, TextField, Button, Typography,  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { collection, doc, setDoc , and ,or,getDocs} from "firebase/firestore"; 
import { query, where } from "firebase/firestore"; 
import { db } from '../config';
import { readDocument } from '../utils/firebaseUtils';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Studios() {
  const [searchTerm, setSearchTerm] = useState('');
  const [studios, setStudios] = useState([]);
  const [searchType, setSearchType] = useState('StudioId'); // Toggle between StudioId and Email
  const [bookingReport, setBookingReport] = useState(null);
  const [reportSearchTerm, setReportSearchTerm] = useState('');

  const handleSearch = async () => {
    try {
      let fetchedStudios = [];
  
      if (searchType === 'Email') {
        // Query by either creatorEmail or mailAddress
        const emailQuery = query(collection(db, "Studio"), or(where('creatorEmail', '==', searchTerm), where('mailAddress', '==', searchTerm)));
  
        // Fetch creatorEmail matches
        const emailQuerySnapshot = await getDocs(emailQuery);
        emailQuerySnapshot.forEach((doc) => {
          fetchedStudios.push({ id: doc.id, ...doc.data() });
        });
  
      } else {
        // Query by StudioId
        const studio = await readDocument("Studio", searchTerm); // Custom function to get a document by StudioId
        if (studio) {
          fetchedStudios.push({ id: searchTerm, ...studio });
        }
      }
  
      // Update state with fetched studios
      setStudios(fetchedStudios);
    } catch (error) {
      console.error('Error fetching studios:', error);
    }
  };

  const handleReportSearch = async () => {
    try {
      const response = await fetch(`https://nrityaserver-2b241e0a97e5.herokuapp.com/reports/studioEntityBookingsReport/?studio_id=${reportSearchTerm}`);
      const data = await response.json();
      setBookingReport(data);

    } catch (error) {
      console.error('Error fetching booking report:', error);
    }
  };

  const downloadCSV = () => {
    const data = [
      // Add header with Studio ID and Studio Name
      [`Studio ID: ${bookingReport.StudioId}`, `Studio Name: ${bookingReport.StudioName}`],
      [],
      // Add table header
      ['Type', 'Name', 'Bookings Count'],
      // Add table data
      ...bookingReport.WORKSHOPS.map(workshop => ['Workshop', workshop.WorkshopName, workshop.BookingsCount]),
      ...bookingReport.OPEN_CLASSES.map(openClass => ['Open Class', openClass.OpenClassName, openClass.BookingsCount]),
      ...bookingReport.COURSES.map(course => ['Course', course.CourseName, course.BookingsCount]),
    ];
  
    // Convert the array of arrays to CSV format
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `studio_booking_report_${bookingReport.StudioName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const downloadExcel = () => {
    // Create a worksheet for the Studio ID and Studio Name
    const studioInfo = XLSX.utils.json_to_sheet([
      { 'Studio ID': bookingReport.StudioId, 'Studio Name': bookingReport.StudioName }
    ], { header: ['Studio ID', 'Studio Name'] });
  
    // Create a worksheet for the table data
    const data = [
      ...bookingReport.WORKSHOPS.map(workshop => ({
        Type: 'Workshop',
        Name: workshop.WorkshopName,
        BookingsCount: workshop.BookingsCount
      })),
      ...bookingReport.OPEN_CLASSES.map(openClass => ({
        Type: 'Open Class',
        Name: openClass.OpenClassName,
        BookingsCount: openClass.BookingsCount
      })),
      ...bookingReport.COURSES.map(course => ({
        Type: 'Course',
        Name: course.CourseName,
        BookingsCount: course.BookingsCount
      })),
    ];
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    
    // Append studio info and table data to the workbook
    XLSX.utils.book_append_sheet(wb, studioInfo, 'Studio Info');
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    
    XLSX.writeFile(wb, `studio_booking_report_${bookingReport.StudioName}.xlsx`);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add Studio ID and Studio Name
    doc.setFontSize(16);
    doc.text(`Studio ID: ${bookingReport.StudioId}`, 14, 20);
    doc.text(`Studio Name: ${bookingReport.StudioName}`, 14, 30);
    
    // Add space before the table
    doc.setFontSize(12);
    doc.text('Report', 14, 40);
    
    // Prepare data for the table
    const tableData = [
      ...bookingReport.WORKSHOPS.map(workshop => ({
        Type: 'Workshop',
        Name: workshop.WorkshopName,
        BookingsCount: workshop.BookingsCount
      })),
      ...bookingReport.OPEN_CLASSES.map(openClass => ({
        Type: 'Open Class',
        Name: openClass.OpenClassName,
        BookingsCount: openClass.BookingsCount
      })),
      ...bookingReport.COURSES.map(course => ({
        Type: 'Course',
        Name: course.CourseName,
        BookingsCount: course.BookingsCount
      })),
    ];
    
    // Add table to PDF
    doc.autoTable({
      startY: 50,
      head: [['Type', 'Name', 'Bookings Count']],
      body: tableData.map(item => [item.Type, item.Name, item.BookingsCount]),
    });
  
    // Save the PDF
    doc.save(`studio_booking_report_${bookingReport.StudioName}.pdf`);
  };
  
  


  return (
    <div>
      <Typography variant="h5">Search Studios</Typography>

      {/* Search Studios by StudioId or Email */}
      <div style={{ marginBottom: '20px' }}>
        <TextField
          label={`Enter ${searchType === 'StudioId' ? 'Studio ID' : 'Email'}`}
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          style={{ marginBottom: '10px' }}
        />

        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={!searchTerm}
        >
          Search
        </Button>

        {/* Toggle between searching by StudioId or Email */}
        <Button onClick={() => setSearchType(searchType === 'StudioId' ? 'Email' : 'StudioId')}>
          Search by {searchType === 'StudioId' ? 'Email' : 'StudioId'}
        </Button>
      </div>

      {/* Render the studio results */}
      {studios.length > 0 ? (
        studios.map((studio, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{studio.studioName || 'Unnamed Studio'}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {Object.keys(studio).map((key) => (
                  <p key={key}>
                    <strong>{key}:</strong> {studio[key] ? studio[key].toString() : 'N/A'}
                  </p>
                ))}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography>No studios found</Typography>
      )}

      <Typography variant="h5" style={{ marginTop: '40px' }}>Get Studio Booking Report</Typography>

      {/* Search for studio booking report by StudioId */}
      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Enter Studio ID"
          variant="outlined"
          value={reportSearchTerm}
          onChange={(e) => setReportSearchTerm(e.target.value)}
          fullWidth
          style={{ marginBottom: '10px' }}
        />

        <Button
          variant="contained"
          onClick={handleReportSearch}
          disabled={!reportSearchTerm}
        >
          Get Booking Report
        </Button>
      </div>

      {bookingReport && (
        <div>
          <Typography variant="h6">Studio: {bookingReport.StudioName}</Typography>
          <Typography variant="subtitle1">Studio ID: {bookingReport.StudioId}</Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Entity Type</TableCell>
                  <TableCell>Entity Name</TableCell>
                  <TableCell>Bookings Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Render workshops */}
                {bookingReport.WORKSHOPS?.map(workshop => (
                  <TableRow key={workshop.WorkshopId}>
                    <TableCell>Workshop</TableCell>
                    <TableCell>{workshop.WorkshopName}</TableCell>
                    <TableCell>{workshop.BookingsCount}</TableCell>
                  </TableRow>
                ))}
                {/* Render open classes */}
                {bookingReport.OPEN_CLASSES?.map(openClass => (
                  <TableRow key={openClass.OpenClassId}>
                    <TableCell>Open Class</TableCell>
                    <TableCell>{openClass.OpenClassName}</TableCell>
                    <TableCell>{openClass.BookingsCount}</TableCell>
                  </TableRow>
                ))}
                {/* Render courses */}
                {bookingReport.COURSES?.map(course => (
                  <TableRow key={course.CourseId}>
                    <TableCell>Course</TableCell>
                    <TableCell>{course.CourseName}</TableCell>
                    <TableCell>{course.BookingsCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Download buttons */}
          <div style={{ marginTop: '20px' }}>
            <Button
              variant="contained"
              onClick={downloadCSV}
            >
              Download as CSV
            </Button>
            <Button
              variant="contained"
              onClick={downloadExcel}
              style={{ marginLeft: '10px' }}
            >
              Download as Excel
            </Button>
            <Button variant="contained" color="primary" onClick={downloadPDF}>
          Download PDF
        </Button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Studios;

