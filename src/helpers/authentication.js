import AsyncStorage from "@react-native-community/async-storage"



//setting up the user login screen/ register_screen
export const setting_up_the_user = async(user_data, apollo_client) => {
    //storing values in async storage
    try{
        //setting up the user_info
        const user_info = JSON.stringify(user_data)
        console.log(user_data,"this is setting")
        await AsyncStorage.setItem("user_info",user_info)

        //setting up jwttoken
        await AsyncStorage.setItem("token", user_data.jwt)
                   
    }catch(e){
        console.log("AsyncStorage Error: "+e)
    }

    //writing to Apollo's local state
    apollo_client.writeData({
        data:{
            user_info:{
                ...user_data,
                __typename:"User_account"
            }
        }
    })
    return
}
