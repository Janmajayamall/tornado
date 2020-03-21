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
        borderBottomColor:base_style.color.primary_color_lighter,
        borderBottomWidth:1,
        width:"100%",
    }
})

export default ListItemDivider