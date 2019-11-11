<template>
  <div>
    <quill-editor
        v-model="text"
        ref="myQuillEditor"
        :options="editorOption"
        @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
        @change="onEditorChange($event)">
    </quill-editor>
    <a-upload
      class="edit_upload"
      :showUploadList="false"
      :customRequest="customRequest"
    >
    </a-upload>
  </div>
</template>

<script>
import { upload } from '@/utils/ossclient'
// 工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{'header': 1}, {'header': 2}], // custom button values
  [{'list': 'ordered'}, {'list': 'bullet'}],
  [{'script': 'sub'}, {'script': 'super'}], // superscript/subscript

  [{'size': ['small', false, 'large', 'huge']}], // custom dropdown
  [{'header': [1, 2, 3, 4, 5, 6, false]}],

  [{'color': []}, {'background': []}], // dropdown with defaults from theme
  [{'font': []}],
  [{'align': []}],
  ['image'],
  ['clean'] // remove formatting button
]
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      text: '',
      // editorOption: {},
      editorOption: {
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              'image': function (value) {
                if (value) {
                  document.querySelector('.edit_upload input').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        }
      }
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  methods: {
    onEditorReady (editor) { // 准备编辑器
    },
    onEditorBlur () {}, // 失去焦点事件
    onEditorFocus () {}, // 获得焦点事件
    // 内容改变事件
    onEditorChange () {
      this.$emit('text', this.text)
    },

    // 上传图片
    customRequest (request) {
      const isJPG = request.file.type === 'image/jpeg'
      const isPNG = request.file.type === 'image/png'
      const isGIF = request.file.type === 'image/gif'
      const isLt2M = request.file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG && !isGIF) {
        this.$message.error('上传图片只能是 JPG/PNG/GIF 格式!')
        return
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return
      }
      if ((isJPG || isPNG || isGIF) && isLt2M) {
        upload(request.file, p => console.log(p)).then(res => {
          console.log(res.url, '---')

          // 获取富文本组件实例
          let quill = this.$refs.myQuillEditor.quill
          // 获取光标所在位置
          let length = quill.getSelection().index
          // 插入图片 res.url为服务器返回的图片地址
          quill.insertEmbed(length, 'image', res.url)
          // 调整光标到最后
          quill.setSelection(length + 1)
        })
      }
    }
  },
  mounted () {
    this.text = this.content
  },
  watch: {
    visible (val) {
      if (val) {
        this.text = this.content
      }
    }
  }
}
</script>
