import { LinearProgress, type LinearProgressProps } from '@mui/material';
import { Typography, Box } from '@mui/material';

export default function LinearProgressWithLabel(props: LinearProgressProps & { progress: number }) {
  return (
    <Box className="flex items-center">
      <Box className="w-full mr-1">
        <LinearProgress variant="determinate" value={props.progress} />
      </Box>
      <Box className="min-w-10">
        <Typography
          variant="body2"
          className="text-secondary"
        >{`${Math.round(props.progress)}%`}</Typography>
      </Box>
    </Box>
  );
}