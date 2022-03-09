import * as React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export default function ExRadio(props) {
    const [value, setValue] = React.useState(props.value)

    const handleRadioChange = (event) => {
        setValue(event.target.value)
    };
    return (
        <FormControl component="fieldset">
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup row aria-label="gender" value={value} name="row-radio-buttons-group" onChange={handleRadioChange}>
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="other" control={<Radio />} label="Other" />
                <FormControlLabel
                    value="disabled"
                    disabled
                    control={<Radio />}
                    label="other"
                />
            </RadioGroup>
        </FormControl>
    );
}