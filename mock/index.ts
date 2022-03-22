export const componentList = [
    {
        id: 0,
        tag: 'SketchText',
        name: '文本',
        attrs: {
            style: {
                width: 200,
                height: 200,
                left: 0,
                top: 0,
                marginTop: 20,
                position: 'relative',
            }
        },
        children: [],
        data: {
            text: '<p style="font-size: 16px;color: #333333">这是一段文本<strong>加粗</strong></p>'
        }
    },
    {
        id: 1,
        name: '图片',
        tag: 'SketchPicture',
        attrs: {
            style: {
                width: 375,
                height: 316,
                left: 0,
                top: 0,
                position: 'relative',
            }
        },
        data: {
            src: 'https://static.vue-js.com/6280b990-ff19-11ea-85f6-6fac77c0c9b3.png'

        },
        children: []
    }
]

export const itemList = [
    { id: 1, data: "Princess Mononoke" },
    { id: 2, data: "Spirited Away" },
    { id: 3, data: "My Neighbor Totoro" },
    { id: 4, data: "Howl's Moving Castle" }
]