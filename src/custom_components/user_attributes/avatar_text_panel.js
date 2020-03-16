import React from "react"
import {
    View,
    Text
} from "react-native"

import Avatar from "./../image/profile_image"

const AvatarTextPanel = (props) => {
    return(
        <View style={styles.main_container}>
            <View style={styles.user_profile_pic_container}>
                <Avatar
                        source={props.avatar}
                />
            </View>

            <View style={styles.user_description_container}>

                <View style={styles.user_description_container_child}>

                    <View>
                        <Text style={base_style.typography.small_header}>
                            {props.username}
                        </Text>
                    </View>

                    <View>
                        <Text style={base_style.typography.small_font}>
                            {props.description}
                        </Text>
                    </View>

                </View>
            </View>
        </View>
    )
}

const styles = {
    main_container:{
        flexDirection:"row"
    },
    user_profile_pic_container:{
        width:'20%',
        justifyContent:'flex-start',
        padding:5,
        borderRadius:2
    },
    user_description_container:{
        width:'80%',
        padding:5
    },
    user_description_container_child:{
        flexDirection:'column',
    },
}

export default React.memo(AvatarTextPanel)
