module.exports = {
    rules: {},
    emptyTable: {aaData: [], iTotalDisplayRecords: 0, iTotalRecords: 0},
    priceStatusMap: {
        active: 'Hoạt động',
        slow: 'Chậm',
        pause: 'Bảo trì',
        stopped: 'Ngừng nhận đơn',
    },
    listServicesByType: [
        {
            name: 'Facebook Speed',
            key: 'fb_speed',
            child: {
                s_like: 'Like bài viết speed',
            }
        },
        {
            name: 'Facebook Buff',
            key: 'facebook',
            child: {
                reactions: 'Tăng Like bài viết chậm',
                follow: 'Sub Trang cá nhân + Fanpage',
                like_page: 'Like Sub Fanpage',
                s_like_comment: 'Tăng Like Comment',
                comment: 'Tăng Bình Luận',
                share: 'Chia Sẻ Bài Viết',
                buff_group: 'Tăng member Group',
                sharegroup: 'Share Lives Group',
                review: 'Đánh giá 5 Sao',
                checkin: 'Check In FanPage',
                fb_event: 'Sự kiện Facebook'
            }
        },
        {
            name: 'Facebook Vip',
            key: 'vipfacebook',
            child: {
                vip_like: 'VIP Like Theo Tháng',
                vip_like_group: 'VIP Like Group Tháng',
                vip_cmt: 'VIP CMT Theo tháng',
                vip_live: 'VIP Mắt Theo Tháng',
                vip_view_video: 'Vip View Video Tháng',
                vip_share: 'Vip Share Theo Tháng'
            }
        },
        {
            name: 'Facebook Bot',
            key: 'reaction',
            child: {
                proxy: 'Proxy',
                bot_comment: 'Bot cảm xúc và Cmt',
                bot_love_story: 'Bot Love và cmt Story',
                filter_friend: 'Lọc bạn bè k tương tác'
            }
        },
        {
            name: 'Mắt-View',
            key: 'view',
            child: {
                livestream_v2: 'Buff Mắt Livestream',
                video: 'Tăng View Video',
                view_story: 'Tăng View Story',
                view_other: 'View 600k phút',
                view_60k_offline: 'View 60k Offline',
                view_60k_live: 'View 60k Live',
                fb_view_100k_reel: 'Tăng view 100k Reels'
            }
        },
        {
            name: 'Mua Bán FanPage',
            key: 'fb_page',
            child: {
                buy: 'Mua Fanpage'
            }
        },
        {
            name: 'Instagram',
            key: 'instagram',
            child: {
                like_instagram: 'Like Instagram',
                comment_instagram: 'Comment Instagram',
                follow_instagram: 'Follow Instagram',
                view_instagram: 'View Instagram',
                live_instagram: 'Mắt Livestream Instagram',
                vip_like_instagram: 'Vip Like Instagram',
                vip_comment_instagram: 'Vip Comment Instagram',
            }
        },
        {
            name: 'Threads',
            key: 'threads',
            child: {
                like_threads: 'Like Threads',
                follow_threads: 'Follow Threads',
            }
        },
        {
            name: 'TikTok',
            key: 'tiktok',
            child: {
                like_tiktok: 'Like TikTok',
                like_comment_tiktok: 'Like Comment TikTok',
                follow_tiktok: 'Follow TikTok',
                view_tiktok: 'View TikTok',
                comment_tiktok: 'Comment TikTok',
                share_tiktok: 'Share TikTok',
                favorite_tiktok: 'Yêu thích Tiktok',
                like_live_tiktok: 'Tim Livestream TikTok',
                share_live_tiktok: 'Share Livestream TikTok',
                comment_live_tiktok: 'Comment Livestream TikTok',
                live_tiktok: 'Mắt LiveStream TikTok',
                pk_tiktok: 'Điểm chiến đấu (PK) Tiktok',

                vip_love_tiktok: 'Vip Love TikTok',
                vip_view_tiktok: 'Vip View TikTok',
            }
        },
        {
            name: 'Shopee',
            key: 'shopee',
            child: {
                follow_shopee: 'Follow Shopee',
                love_shopee: 'Love Shopee',
                like_review_shopee: 'Like Review Shopee',
                live_shopee: 'Mắt Livestream Shopee',
            }
        },
        {
            name: 'Telegram',
            key: 'telegram',
            child: {
                member_telegram: 'Member telegram',
                view_telegram: 'View Bài Viết telegram',
                reaction_telegram: 'Cảm Xúc Bài Viết Telegram'
            }
        },
        {
            name: 'Youtube',
            key: 'youtube',
            child: {
                like_youtube: 'Like Youtube',
                like_youtube_short: 'Like Youtube Short',
                view_youtube: 'View Youtube',
                view_youtube_short: 'View Youtube Short',
                view_youtube_4k: 'View Youtube 4000H',
                live_youtube: 'Livestream Youtube',
                comment_youtube: 'Comment Youtube',
                like_comment_youtube: 'Like Comment Youtube',
                sub_youtube: 'Subscribe Youtube',
                tick_youtube: 'Tick Nghệ Sĩ Youtube',
            }
        },
        {
            name: 'Twitter',
            key: 'twitter',
            child: {
                like_twitter: 'Like Twitter',
                follow_twitter: 'Follow Twitter',
                view_twitter: 'View Twitter',
                retweet_twitter: 'Retweet Twitter',
                live_twitter: 'Livestream Twitter',

                comment_twitter: 'Comment Twitter',
                vip_like_twitter: 'Vip Like Twitter',
                vip_view_twitter: 'Vip View Twitter',
            }
        },
        {
            name: 'Lazada',
            key: 'lazada',
            child: {
                sub_lazada: 'Sub Lazada',
            }
        },
        {
            name: 'Google',
            key: 'google',
            child: {
                google_map: 'Google Map',
                rip_google_map: 'RIP Google Map',
                google_map_review: 'Review 5* Google Map',
            }
        },
    ],
    reportFields: {
        id: 'ID',
        uid: 'UID',
        msg: 'Nội dung',
        count: 'Số lượng',
        price: 'Giá',
        price_current: 'Tiền trước',
        price_left: 'Tiền sau',
        math: 'Tăng/Giảm',
        type: 'Loại',
        server: 'Server',
        time: 'Thời gian',
        original: 'Gốc',
        present: 'Đã tăng',
        note: 'Ghi chú',
        status: 'Trạng thái',
    },
    USD_RATE: 24_000,
};
