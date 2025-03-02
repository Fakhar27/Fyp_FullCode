import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"
import * as yup from "yup"
import { useNavigate, json } from "react-router-dom"
import { useContext } from 'react';
import AuthContext from './utils/AuthContext';


export default function Register() {
    let {createUser, errorMessage, seterrorMessage} = useContext(AuthContext)
    

    let navigate = useNavigate()

    const schema = yup.object().shape({
        name: yup.string().min(3).max(12).required("NAME IS REQUIRED, MAKE SURE USERNAME IS UPTO 12 WORDS"),
        password : yup.string().min(3).max(30).required("PASSWORD IS REQUIRED"),
        confirm_password : yup.string().oneOf([yup.ref("password"),null],"PLEASE MATCH PASSWORDS").required(),
    })

    const {register,handleSubmit,formState:{errors}} = useForm({
        resolver : yupResolver(schema),
        mode : "onChange"
    })

    const onSubmit = (data) => {
        createUser(data.name, data.password);
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item xs={12}>
                            <Typography variant="h6" align="center">
                                REGISTERATION
                            </Typography>
                        </Grid>
                        {errorMessage && <div style={{ color: 'red', fontWeight: 'bold', textAlign: 'center', marginTop: '10px' }}>{errorMessage}</div>}
                        <Grid item xs={12}>
                            <TextField fullWidth name='username' label="Username" variant="outlined" {...register("name")}/>
                            <small className='errors'>
                                {errors.name && errors.name.message}
                            </small>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth name='password' label="Password" variant="outlined" type="password" {...register("password")}/>
                            <small className='errors'>
                                {errors.password && errors.password.message}
                            </small>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Confirm Password" variant="outlined"  type="password" {...register("confirm_password")}/>
                            <small className='errors'>
                                {errors.confirm_password && errors.confirm_password.message}
                            </small>
                        </Grid>
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="center">
                                <Button type="submit" variant="contained" color="primary">
                                    Register
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} align="center">
                            <p>ALREADY HAVE AN ACCOUNT??? <Button color="primary" 
                            onClick={() => {
                                seterrorMessage(null);
                                navigate("/login/")}}>CLICK HERE</Button></p>
                            {/* <p>ALREADY HAVE AN ACCOUNT??? <a href={navigate("login/")}>CLICK HERE</a></p> */}
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}
