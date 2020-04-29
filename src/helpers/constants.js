import {
    Platform
} from "react-native"
export const constants = {
    navigation:{
        action_buttons:{
            ADD_POST:"add_post",
            VIEW_PROFILE:"view_profile",
            SHARE_POST:"share_post",
            ADD_ROOM:"add_room",
            CREATE_ROOM:"create_room",
            EDIT_PROFILE:"edit_profile",
            DONE_POST_ROOM_SELECTION:"done_post_room_selection",
            SEARCH_ROOMS:"search_rooms",
            FOLLOW_BULK:"follow_bulk",
            SETTINGS:"settings",
            BACK:"back"
        }
    },
    queries:{
        get_all_joined_rooms:"GET_ALL_JOINED_ROOMS",
        get_all_created_rooms:"GET_ALL_CREATED_ROOMS",
        get_common_rooms:"GET_COMMON_ROOMS",
        get_likes_list:"GET_LIKES_LIST",
        get_room_members_list:"GET_ROOM_MEMBERS_LIST"
    },
    create_post_type:{
        room_post:"ROOM_POST",
        room_caption_post:"ROOM_CAPTION_POST"
    },
    status:{
        active:"ACTIVE",
        not_active:"NOT_ACTIVE"
    },
    avatar_text_panel_type:{
        user:"USER",
        comment_display:"COMMENT_DISPLAY",
        comment_input:"COMMENT_INPUT",
        caption:"CAPTION",
        caption_input:"CAPTION_INPUT"
    },
    comment_list_query_type:{
        caption_query:"CAPTION_QUERY",
        comment_query:"COMMENT_QUERY"
    },
    vote_type:{
        up:"UP",
        down:"DOWN"
    },
    post_types:{
        room_post:"ROOM_POST",
        room_caption_post:"ROOM_CAPTION_POST"
    },
    input_limits:{
        username:30,
        post_description:2000,
        caption:2000,
        bio:500,
        three_words:40,
        min_age:13,
        max_password:100,
        min_password:8,
        name:100,
        room_name:50,
        room_description:1000,
        comment:2000,
        max_age:150,
        reporting:2000
    },
    apollo_query:{
        network_status:{
            refetch:4, 
            fetchMore:3, 
            ready:7,
            error:8,
            loading:1, 
            setVariables:2,
            poll:6
        },
        pagination_limit:10
    },
    terms_and_conditions:
        Platform.OS==="ios" ?
`
Tornado App End User License Agreement 

This End User License Agreement (“Agreement”) is between you and Tornado and governs use of this app made available through the Apple App Store. By installing the Tornado App, you agree to be bound by this Agreement and \
understand that there is no tolerance for objectionable content. If you do not agree with the terms and conditions of this Agreement, you are not entitled to use the Tornado App. 

In order to ensure Tornado provides the best experience possible for everyone, we strongly enforce a no tolerance policy for objectionable content.If you see inappropriate content, please use the “Report” feature found under each post. 

1. Parties
This Agreement is between you and Tornado only, and not Apple, Inc. (“Apple”). Notwithstanding the foregoing, you acknowledge that Apple and its subsidiaries are third party beneficiaries of this Agreement and Apple has the right to enforce this Agreement against you. Tornado, not Apple, is solely responsible for the Tornado App and its content. 

2. Privacy
Tornado may collect and use information about your usage of the Tornado App, including certain types of information from and about your device. Tornado may use this information, as long as it is in a form that does not personally identify you, to measure the use and performance of the Tornado App. 

3. Limited License
Tornado grants you a limited, non-exclusive, non-transferable, revocable license to use the Tornado App for your personal, non-commercial purposes. You may only use the Tornado App on Apple devices that you own or control and as permitted by the App Store Terms of Service. 

4. Age Restrictions 
By using the Tornado App, you represent and warrant that
(a) you are 17 years of age or older and you agree to be bound by this Agreement; (b) if you are under 17 years of age, you have obtained verifiable consent from a parent or legal guardian; and (c) your use of the Tornado App does not violate any applicable law or regulation. Your access to the Tornado App may be terminated without warning if Tornado believes, in its sole discretion, that you are under the age of 17 years and have not obtained verifiable consent from a parent or legal guardian. If you are a parent or legal guardian and you provide your consent to your child’s use of the Tornado App, you agree to be bound by this Agreement in respect to your child’s use of the Tornado App. 

5. Objectionable Content Policy
Content may not be submitted to Tornado, who will moderate all content and ultimately decide whether or not to post a submission to the extent such content includes, is in conjunction with, or alongside any, Objectionable Content. Objectionable Content includes, but is not limited to: (i) sexually explicit materials; (ii) obscene, defamatory, libelous, slanderous, violent and/or unlawful content or profanity; (iii) content that infringes upon the rights of any third party, including copyright, trademark, privacy, publicity or other personal or proprietary right, or that is deceptive or fraudulent; (iv) content that promotes the use or sale of illegal or regulated substances, tobacco products, ammunition and/or firearms; and (v) gambling, including without limitation, any online casino, sports books, bingo or poker.

6. Warranty
Tornado disclaims all warranties about the Tornado App to the fullest extent permitted by law. To the extent any warranty exists under law that cannot be disclaimed, Tornado, not Apple, shall be solely responsible for such warranty.

7. Maintenance and Support 
Tornado does provide minimal maintenance or support for it but not to the extent that any maintenance or support is required by applicable law, Tornado, not Apple, shall be obligated to furnish any such maintenance or support. 

8. Product Claims 
Tornado, not Apple, is responsible for addressing any claims by you relating to the Tornado App or use of it, including, but not limited to: (i) any product liability claim; (ii) any claim that the Tornado App fails to conform to any applicable legal or regulatory requirement; and (iii) any claim arising under consumer protection or similar legislation. Nothing in this Agreement shall be deemed an admission that you may have such claims. 

9. Third Party Intellectual Property Claims
Tornado shall not be obligated to indemnify or defend you with respect to any third party claim arising out or relating to the Tornado App. To the extent Tornado is required to provide indemnification by applicable law, Tornado, not Apple, shall be solely responsible for the investigation, defense, settlement and discharge of any claim that the Tornado App or your use of it infringes any third party intellectual property right. 
`:
`
Tornado App End User License Agreement 

By installing the Tornado App, you agree to be bound by this Agreement and \
understand that there is no tolerance for objectionable content. If you do not agree with the terms and conditions of this Agreement, you are not entitled to use the Tornado App. 

In order to ensure Tornado provides the best experience possible for everyone, we strongly enforce a no tolerance policy for objectionable content.If you see inappropriate content, please use the “Report” feature found under each post. 

1. Privacy
Tornado may collect and use information about your usage of the Tornado App, including certain types of information from and about your device. Tornado may use this information, as long as it is in a form that does not personally identify you, to measure the use and performance of the Tornado App. 

2. Limited License
Tornado grants you a limited, non-exclusive, non-transferable, revocable license to use the Tornado App for your personal, non-commercial purposes. 

3. Age Restrictions 
By using the Tornado App, you represent and warrant that
(a) you are 17 years of age or older and you agree to be bound by this Agreement; (b) if you are under 17 years of age, you have obtained verifiable consent from a parent or legal guardian; and (c) your use of the Tornado App does not violate any applicable law or regulation. Your access to the Tornado App may be terminated without warning if Tornado believes, in its sole discretion, that you are under the age of 17 years and have not obtained verifiable consent from a parent or legal guardian. If you are a parent or legal guardian and you provide your consent to your child’s use of the Tornado App, you agree to be bound by this Agreement in respect to your child’s use of the Tornado App. 

4. Objectionable Content Policy
Content may not be submitted to Tornado, who will moderate all content and ultimately decide whether or not to post a submission to the extent such content includes, is in conjunction with, or alongside any, Objectionable Content. Objectionable Content includes, but is not limited to: (i) sexually explicit materials; (ii) obscene, defamatory, libelous, slanderous, violent and/or unlawful content or profanity; (iii) content that infringes upon the rights of any third party, including copyright, trademark, privacy, publicity or other personal or proprietary right, or that is deceptive or fraudulent; (iv) content that promotes the use or sale of illegal or regulated substances, tobacco products, ammunition and/or firearms; and (v) gambling, including without limitation, any online casino, sports books, bingo or poker.
`
}