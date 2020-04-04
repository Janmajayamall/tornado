import React from "react"
import { 
    View,
    StyleSheet
 } from "react-native";

const ListItemDivider = () => {
    return(
        <View style={styles.main_container}/>
    )
}

const styles = StyleSheet.create({
    main_container:{
        backgroundColor:base_style.color.primary_color_lighter,
        height:2.5,
        width:"100%",        
    }
})

export default ListItemDivider