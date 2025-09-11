import React from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  IconButton,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const FORM_FIELD_HEIGHT = 56;

const WorkshopStep2EventInfo = ({
  onBack,
  onSubmit,
  formData,
  setFormData,
}) => {
  const handleVariantChange = (index, field) => (e) => {
    const value = e?.target?.value ?? e;
    const updatedVariants = [...formData.variants];
    updatedVariants[index][field] = value;
    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const handleSubvariantChange = (variantIndex, subvariantIndex, field) => (e) => {
    const value = e?.target?.value ?? e;
    const updatedVariants = [...formData.variants];
    updatedVariants[variantIndex].subvariants[subvariantIndex][field] = value;
    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
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
    }));
  };

  const removeVariant = (index) => {
    const updatedVariants = [...formData.variants];
    updatedVariants.splice(index, 1);
    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const addSubvariant = (variantIndex) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[variantIndex].subvariants.push({
      price: "",
      capacity: "",
      description: "",
    });
    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const removeSubvariant = (variantIndex, subvariantIndex) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[variantIndex].subvariants.splice(subvariantIndex, 1);
    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography
          variant="h6"
          sx={{
            color: "black",
            textTransform: "capitalize",
          }}
          gutterBottom
        >
          Event Schedule & Pricing
        </Typography>
      </Grid>

      {formData.variants.map((variant, variantIndex) => (
        <React.Fragment key={variantIndex}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontSize: "16px",
                  color: "black",
                }}
              >
                Event {variantIndex + 1}
              </Typography>
              {formData.variants.length > 1 && (
                <IconButton
                  onClick={() => removeVariant(variantIndex)}
                  sx={{ color: "black" }}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
            <Paper
              elevation={2}
              sx={{
                mb: 3,
                p: 3,
                borderRadius: 2,
                bgcolor: "unset",
              }}
            >
              <Grid container rowSpacing={3} columnSpacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "16px",
                      color: "black",
                    }}
                    gutterBottom
                  >
                    Date
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      name="date"
                      sx={{ width: "100%" }}
                      value={variant.date ? dayjs(variant.date) : null}
                      onChange={handleVariantChange(variantIndex, "date")}
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

                <Grid item xs={12} md={4}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "16px",
                      color: "black",
                    }}
                    gutterBottom
                  >
                    Time (e.g., 09:00-17:00)
                  </Typography>
                  <TextField
                    fullWidth
                    name="time"
                    value={variant.time}
                    onChange={handleVariantChange(variantIndex, "time")}
                    sx={{ height: FORM_FIELD_HEIGHT }}
                    variant="outlined"
                    InputLabelProps={{ shrink: false }}
                    placeholder="09:00-17:00"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "16px",
                      color: "black",
                    }}
                    gutterBottom
                  >
                    Event Description
                  </Typography>
                  <TextField
                    fullWidth
                    name="description"
                    value={variant.description}
                    onChange={handleVariantChange(variantIndex, "description")}
                    sx={{ height: FORM_FIELD_HEIGHT }}
                    variant="outlined"
                    InputLabelProps={{ shrink: false }}
                    placeholder="Description"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "16px",
                        color: "black",
                      }}
                      gutterBottom
                    >
                      Pricing Options
                    </Typography>
                    <Button
                      onClick={() => addSubvariant(variantIndex)}
                      startIcon={<AddIcon />}
                      size="small"
                      sx={{ textTransform: "capitalize" }}
                    >
                      Add Pricing
                    </Button>
                  </Box>

                  {variant.subvariants.map((subvariant, subvariantIndex) => (
                    <Grid
                      key={subvariantIndex}
                      container
                      rowSpacing={3}
                      columnSpacing={2}
                      sx={{
                        mb:
                          subvariantIndex !== variant.subvariants.length - 1
                            ? 2
                            : 0,
                      }}
                    >
                      <Grid item xs={12} sm={3}>
                        <Typography
                          variant="body1"
                          sx={{ fontSize: "16px" }}
                          gutterBottom
                        >
                          Price
                        </Typography>
                        <TextField
                          fullWidth
                          name="price"
                          value={subvariant.price}
                          onChange={handleSubvariantChange(
                            variantIndex,
                            subvariantIndex,
                            "price"
                          )}
                          sx={{ height: FORM_FIELD_HEIGHT }}
                          variant="outlined"
                          InputLabelProps={{ shrink: false }}
                          placeholder="Enter price"
                          type="number"
                        />
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <Typography
                          variant="body1"
                          sx={{ fontSize: "16px" }}
                          gutterBottom
                        >
                          Capacity
                        </Typography>
                        <TextField
                          fullWidth
                          name="capacity"
                          value={subvariant.capacity}
                          onChange={handleSubvariantChange(
                            variantIndex,
                            subvariantIndex,
                            "capacity"
                          )}
                          sx={{ height: FORM_FIELD_HEIGHT }}
                          variant="outlined"
                          InputLabelProps={{ shrink: false }}
                          placeholder="Enter capacity"
                          type="number"
                        />
                      </Grid>

                      <Grid item xs={12} sm={5}>
                        <Typography
                          variant="body1"
                          sx={{ fontSize: "16px" }}
                          gutterBottom
                        >
                          Description
                        </Typography>
                        <TextField
                          fullWidth
                          name="description"
                          value={subvariant.description}
                          onChange={handleSubvariantChange(
                            variantIndex,
                            subvariantIndex,
                            "description"
                          )}
                          sx={{ height: FORM_FIELD_HEIGHT }}
                          variant="outlined"
                          InputLabelProps={{ shrink: false }}
                          placeholder="Description"
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={1}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {variant.subvariants.length > 1 && (
                          <IconButton
                            onClick={() =>
                              removeSubvariant(variantIndex, subvariantIndex)
                            }
                            sx={{ color: "black" }}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </React.Fragment>
      ))}

      <Grid item xs={12} sx={{ pb: 2 }}>
        <Button
          size="small"
          onClick={addVariant}
          startIcon={<AddIcon />}
          sx={{ textTransform: "capitalize" }}
        >
          Add Another Event
        </Button>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            type="button"
            sx={{
              bgcolor: "#67569E",
              color: "white",
              textTransform: "capitalize",
              "&:hover": { bgcolor: "#67569E", color: "white" },
            }}
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            type="button"
            sx={{
              bgcolor: "#67569E",
              color: "white",
              textTransform: "capitalize",
              "&:hover": { bgcolor: "#67569E", color: "white" },
            }}
            onClick={onSubmit}
          >
            Submit Workshop
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default WorkshopStep2EventInfo;

