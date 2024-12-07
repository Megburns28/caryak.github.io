import { TextField, TextFieldProps } from '@mui/material';
import { FC, useState } from 'react';

const HelperTextField: FC<TextFieldProps> = (props) => {
    const [focused, setFocused] = useState(true);

    return (
        <TextField
            {...props}
            onFocus={(e) => {
                setFocused(true);
                if (props.onFocus) props.onFocus(e);
            }}
            onBlur={(e) => {
                setFocused(false);
                if (props.onBlur) props.onBlur(e);
            }}
            error={!focused && props.error}
            helperText={focused || !props.error ? null : props.helperText}
        />
    );
};

export default HelperTextField;
