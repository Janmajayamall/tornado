import React from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Dimensions
} from 'react-native'
import PropTypes from 'prop-types'

//customer components
import AsyncImage from './../image/image'
import Avatar from './../image/profile_image'

defaultContent={
    user_profile:{
        avatar:'https://www.nowrunning.com/content/Artist/Zendaya/banner.jpg',
        creative_name:'JayZendaya',
    },
    brand:['addidas', 'nike'],
    trend:['olympics'],
    posted_image:'https://www.rollingstone.com/wp-content/uploads/2018/10/colin-Kaepernick-just-do-it-nike-ad-2018.jpg?resize=1800,1200&w=450',
    likes:10,
    description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
}

const window = Dimensions.get('window')
class ContentBox extends React.Component {

    static propTypes = {
        
    }

    constructor(props){

        super(props)

        this.state={
            ...defaultContent
        }

    }

    render(){
        return(
            <View style={styles.main_container}>
            
                <View>
                    <AsyncImage
                        source={this.state.posted_image}
                    />
                </View>
            
                <View style={styles.user_content_container}>

                    <View style={styles.user_profile_pic_container}>
                        <Avatar
                                source={this.state.user_profile.avatar}
                        />
                    </View>

                    <View style={styles.user_description_container}>
                    
                        <View style={styles.user_description_container_child}>
                 
                            <View>
                                <Text style={base_style.typography.small_header}>
                                    {this.state.user_profile.creative_name}
                                </Text>
                            </View>

                            <View>
                                <Text style={base_style.typography.small_font}>
                                    {this.state.description}
                                </Text>
                            </View>

                        </View>

                    </View>
                </View>

                <View style={{backgroundColor:"#2c2c2c", width:"100%", height:10}}/>
                

                {/* <View style={styles.horizontal_line}/> */}

            </View>
        )
    }

}

const styles = StyleSheet.create({

    main_container:{
        backgroundColor:base_style.color.primary_color,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        marginTop:15,
        marginBottom:15
    },
    user_content_container:{
        flexDirection:'row',
        borderRadius:10,
        padding:5
    },
    user_profile_pic_container:{
        width:'20%',
        justifyContent:'flex-start',
        padding:5
    },
    user_description_container:{
        width:'80%',
        padding:5
    },
    user_description_container_child:{
        flexDirection:'column',
    },
    horizontal_line:{
        borderBottomColor:base_style.color.primary_color_lighter,
        borderBottomWidth:1,
        width:"80%",
    }
})

export default ContentBox