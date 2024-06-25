import React from 'react';
import { Box, Typography } from "@mui/material";
import ProgressCircle from "./ProgressCircle";

const StatBox = ({ title, subtitle, progress, increase, icon }) => {
  console.log('StatBox title', title);
  console.log('StatBox subtitle', subtitle);
  console.log('StatBox icon', icon);
  console.log('StatBox progress', progress);
  return (
    <Box display="flex" flexDirection="column" alignItems="center" p="0px">
      <Box display="flex" alignItems="center">
        {icon}
        <Typography variant="h4" fontWeight="bold">{title}</Typography>
      </Box>
      <Typography variant="h5">{subtitle}</Typography>
      {/* <ProgressCircle progress={progress} /> */}
      {/* <Typography variant="caption" color="textSecondary">{increase}</Typography> */}
    </Box>
  );
};

export default StatBox;
