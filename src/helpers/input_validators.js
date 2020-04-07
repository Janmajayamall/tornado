import {
    constants
} from "./index"
import {
    CHECK_USERNAME,
    CHECK_EMAIL
} from "./../apollo_client/apollo_queries/index"

export const validate_email = async(email, apollo_client) => {

    if(email.trim()===""){
        return({
            valid:false,
            error_text:"Please enter your email"
        })
    }

    //checking whether email exists or not
    const {data} = await apollo_client.query({
        query:CHECK_EMAIL,
        variables:{
            email:email.toLowerCase().trim()
        }
    })
   
    if(data.check_email){
        return ({
            valid:false,
            error_text:"Username already in use"
        })
    }

    return ({
        valid:true
    })
}

export const validate_password = (password) => {

    if(password.trim()===0){
        return ({
            valid:false, 
            error_text:"Please enter password"
        })
    }

    password = password.trim()

    if(password.length<constants.input_limits.min_password || password.length>constants.input_limits.max_password){
        return ({
            valid:false,
            error_text:"Password should be of length 8 to 100 characters"
        })
    }
    return ({
        valid:true
    })
}


export const validate_username = async(username, apollo_client) => {

    if (username.trim()===""){
        return ({
            valid:false,
            error_text:"Please enter username"
        })
    }

    username = username.trim()

    if(username.length>constants.input_limits.username){
        return ({
            valid:false,
            error_text:`Username should be of less than ${constants.input_limits.username} characters`
        })
    }

    //checking whether username exists or not
    const {data} = await apollo_client.query({
        query:CHECK_USERNAME,
        variables:{
            username:username.toLowerCase().trim()
        }
    })
    if(data.check_username){
        return ({
            valid:false,
            error_text:"Username already in use"
        })
    }

    return ({
        valid:true
    })
}

export const validate_three_words = (three_words) => {
    
    if(three_words.trim()===""){
        return ({
            valid:true
        }) // three_words is not required
    }

    three_words = three_words.trim()

    if(three_words.length>constants.input_limits.three_words){
        return ({
            valid:false,
            error_text:`Short line should be of less than ${constants.input_limits.three_words} characters`
        })
    }

    return({
        valid:true
    })
}

export const validate_age = (age) => {

    if(age.trim()===""){
        return({
            valid:false,
            error_text:"Please enter your age"
        })  
    }
    
    age = parseInt(age)

    //checking isNaN
    if(isNaN(age)){
        return ({
            valid:false,
            error_text:"Enter valid age"
        })
    }

    //checking min age
    if(age<constants.input_limits.min_age){
        return ({
            valid:false,
            error_text:"Your age cannot be negative"
        })
    }

    //checking max age
    if(age>constants.input_limits.max_age){
        return ({
            valid:false,
            error_text:"Please enter valid age"
        })
    }

    return ({
        valid:true
    })
}

export const validate_name = async(name) => {

    if(name.trim()===""){
        return ({
            valid:true
        })
    }

    name = name.trim()

    if(name.length>constants.input_limits.name){
        return ({
            valid:false, 
            error_text:`Name should be less than ${constants.input_limits.name} characters`
        })
    }
    
    return ({
        valid:true
    })
}

export const validate_bio = (bio) => {

    if(bio.trim()===""){
        return({
            valid:true
        })
    }
    
    bio = bio.trim()

    if(bio.length>constants.input_limits.bio){
        return({
            valid:false,
            error_text:`Bio should be less than ${constants.input_limits.bio} characters`

        })
    }

}


