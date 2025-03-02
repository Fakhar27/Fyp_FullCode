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
import { useContext } from 'react';
import AuthContext from './utils/AuthContext';
import { useNavigate } from 'react-router-dom';



export default function Login(){
    let navigate = useNavigate()

    const schema = yup.object().shape({
        name: yup.string().required("NAME IS REQUIRED"),
        password : yup.string().min(3).max(30).required("PASSWORD IS REQUIRED"),
    })

    const {register,handleSubmit,formState:{errors}} = useForm({
        resolver : yupResolver(schema),
        mode : "onChange"
    })

    let {loginuser,errorMessage,seterrorMessage} = useContext(AuthContext)

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <form onSubmit={loginuser}>
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item xs={12}>
                            <Typography variant="h6" align="center">
                                LOGIN 
                            </Typography>
                        </Grid>
                        {errorMessage && <div style={{ color: 'red', fontWeight:"bolder" ,textAlign: 'center', marginTop: '20px', marginBottom: "20px" }}>{errorMessage}</div>}
                        <Grid item xs={12}>
                            <TextField fullWidth variant='outlined' name="username" label="Username" {...register("username")}/>
                            <small className='errors'>
                                {errors.name && errors.name.message}
                            </small>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth variant='outlined' name="password" type="password" label="Password" {...register("password")}/>
                            <small className='errors'>
                                {errors.password && errors.password.message}
                            </small>
                        </Grid>
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="center">
                                <Button type="submit" variant="contained" color="primary">
                                    Login
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} align="center">
                            <p>DON'T HAVE AN ACCOUNT??? <Button color="primary" 
                            onClick={() => {
                                seterrorMessage(null);
                                navigate("/");}}>CLICK HERE</Button></p>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}