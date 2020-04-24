import React from "react"
import { 
    View,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from "react-native";
import {
    Mutation,
    ApolloConsumer
} from "react-apollo"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import PropTypes from "prop-types"

//importing base style 
import base_style from "./../../../styles/base"

//importing helpers
import {get_relative_time_ago} from "./../../../helpers/index"

//importing custom components
import ProfileImage from "./../../../custom_components/image/profile_image"
import HyperLinkText from "./../../../custom_components/text/hyper_link_text"


class ProfileDetails extends React.PureComponent{

    static propTypes={
        width:PropTypes.any,
        user_info:PropTypes.object
    }

    constructor(props){
        super(props)

        this.state = {
        }

    }

    get_relative_time_ago = (timestamp) => {
        return get_relative_time_ago(timestamp)
    }

    
    render(){
        return(

            <View style={styles.main_container}>

                <View style={styles.first_container}>            
                    <View style={styles.username_container}>
                        <Text style={styles.username_text}>
                            {this.props.user_info.username}
                        </Text>
                        {
                            this.props.user_info.three_words.trim()!==""?
                                <Text style={styles.three_word_text}>
                                    {this.props.user_info.three_words}
                                </Text>:undefined
                        }
                    </View>
                    {/* display chosen image, initially display default image */}
                    <ProfileImage
                        image_object={this.props.user_info.avatar}
                        width={this.props.width*0.3}
                        default_avatar={this.props.user_info.default_avatar}
                    />
                </View>
                <View style={styles.third_container}>
                    <HyperLinkText 
                        style={styles.bio_text}
                        trim={true}
                        numberOfLines={2}
                    >
                        {this.props.user_info.bio}
                    </HyperLinkText>
                </View>
                <Text style={styles.joined_text}>
                        {`Joined ${get_relative_time_ago(this.props.user_info.timestamp)}`}
                </Text>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    main_container:{
        backgroundColor:base_style.color.primary_color,
        width:"100%",
    }, 
    first_container:{
        justifyContent:"center",
        alignItems:"center",
    },
    username_container:{
        marginTop:10,
        marginBottom:10,
        justifyContent:"center",
        alignItems:"center"
    },
    username_text:{
        ...base_style.typography.medium_header,
    },
    second_container:{
        justifyContent:"center",
        alignItems:"center",
        marginTop:10,
        flexDirection:"row"
    },
    three_word_text:{
        ...base_style.typography.small_font,
    },
    third_container:{
        // justifyContent:"center",
        // alignItems:"center",
        marginTop:10
    },
    bio_text:{
        ...base_style.typography.small_font_paragraph,
    },
    joined_text:{
        ...base_style.typography.small_font, 
        ...base_style.typography.font_colors.low_emphasis, 
        alignSelf:"flex-end",
        marginTop:10
    }
})

export default ProfileDetails