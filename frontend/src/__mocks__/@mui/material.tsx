import React from 'react';

const Box = ({ children, sx, ...props }: any) => <div style={sx} {...props}>{children}</div>;
const Grid = ({ children, container, item, xs, spacing, sx, ...props }: any) => <div style={sx} {...props}>{children}</div>;
const Paper = ({ children, sx, ...props }: any) => <div style={sx} {...props}>{children}</div>;
const Typography = ({ children, variant, color, sx, ...props }: any) => <div style={sx} {...props}>{children}</div>;
const TextField = ({ value, onChange, placeholder, label, multiline, rows, InputProps, sx, fullWidth, ...props }: any) => (
  <div style={{ width: fullWidth ? '100%' : 'auto' }}>
    {label && <label htmlFor={`${label}-input`}>{label}</label>}
    <input
      id={`${label}-input`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-label={label}
      style={{ width: '100%' }}
      {...props}
    />
  </div>
);
const Button = ({ children, variant, component, startIcon, onClick, type, sx, ...props }: any) => (
  <button onClick={onClick} type={type} {...props}>{startIcon}{children}</button>
);
const IconButton = ({ children, onClick, ...props }: any) => (
  <button onClick={onClick} {...props}>{children}</button>
);
const Avatar = ({ src, alt, children, ...props }: any) => (
  <div {...props}>{children}</div>
);
const Card = ({ children, sx, ...props }: any) => <div style={sx} {...props}>{children}</div>;
const CardContent = ({ children, ...props }: any) => <div {...props}>{children}</div>;
const CardMedia = ({ component, src, controls, sx, ...props }: any) => {
  const Component = component || 'img';
  return <Component src={src} controls={controls} style={sx} {...props} />;
};
const Dialog = ({ open, onClose, children, ...props }: any) => (
  open ? <div role="dialog" {...props}>{children}</div> : null
);
const DialogTitle = ({ children, ...props }: any) => <div {...props}>{children}</div>;
const DialogContent = ({ children, ...props }: any) => <div {...props}>{children}</div>;
const DialogActions = ({ children, ...props }: any) => <div {...props}>{children}</div>;
const Chip = ({ label, size, sx, ...props }: any) => (
  <span style={sx} {...props}>{label}</span>
);

export {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
};