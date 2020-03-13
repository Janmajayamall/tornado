import React from 'react'
import { connect } from 'react-redux'
import {
    View,
    StyleSheet,
    Text,
    ScrollView

} from 'react-native'
import base_style from './../../styles/base'

//importing components 
import ContentBox from './../../custom_components/content_list/content_box'


class FeedScreen extends React.Component {

    constructor(props){

        super(props)

        this.state={

        }

    }

    render(){
        return(
            <View style={styles.main_container}>
                
                <ScrollView
                    contentContainerStyle={{
                        flexGrow:1,
                        justifyContent:'space-between'
                    }}>
                    <ContentBox/>
                    <ContentBox/>

                </ScrollView>
                
            </View>
        )
    }

}

const styles = StyleSheet.create({

    main_container:{
        backgroundColor:base_style.color.primary_color,
        flex:1
    },

})

const mapStateToProps = (state) => {
    return {
    }
}

const mapDisptachToProps = (dispatch) => {
    return {
    }
}


export default connect(mapStateToProps, mapDisptachToProps)(FeedScreen)