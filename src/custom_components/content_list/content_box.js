import React from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView
} from 'react-native'
import PropTypes from 'prop-types'


class ContentBox extends React.Component {

    static propTypes = {

    }

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
                    <Text>
                        dad
                    </Text>
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


export default ContentBox