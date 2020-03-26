import React from "react"
import {

} from "react-native"
import {
    Query
} from "react-apollo"

//importing custom components
import CommentList from "../../../custom_components/comments/comment_list"

//importing queries
import {GET_POST_COMMENTS} from "../queries/index"

const QueryComments = (props) => {
    return(
        <Query
            query={GET_POST_COMMENTS}
            variables={{
                content_id:props.content_id,
                content_type:props.content_type, //TODO: make it dynamic
            }}
        >
            {({loading, error, data, refetch, networkStatus}) => {
                //TODO: fix the comment retrieval here
                return(
                    <CommentList
                        comment_list={data ? data.get_post_comments : []}
                        post_object={props.post_object}
                        error={error}
                        loading={loading}
                        refresh_list={()=>{
                            refetch()
                        }}
                        network_status={networkStatus}
                        bottom_padding={props.bottom_padding}
                        toggle_post_like={props.toggle_post_like}
                    />
                )

            }}
        </Query>
    )
}

export default React.memo(QueryComments)