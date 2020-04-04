import React from "react"
import {  
    View,
    StyleSheet,
    ActivityIndicator
} from "react-native";
import PropTypes from "prop-types"

//base style
import base_style from "./../../styles/base"


class CaptionPanel extends React.PureComponent{

    static propTypes = {
    }

    constructor(props){
        super(props)

        this.state = {

        }
    }

    render(){
        return(
            <View style={styles.main_container}>
                <ActivityIndicator
                    color={base_style.color.secondary_color}
                    size={"large"}
                />        
            </View>                                          
        )
    }

}

export default CaptionPanel

const styles = StyleSheet.create({
    main_container:{
        flex:1,
        width:"100%",
        justifyContent:"center",
        alignItems:"center"
    }
})