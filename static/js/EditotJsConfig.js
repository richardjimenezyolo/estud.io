const editor = new EditorJS({ 
  /** 
   * Id of Element that should contain the Editor 
   */ 
  holder: 'editorjs', 
  
  /** 
   * Available Tools list. 
   * Pass Tool's class or Settings object for each Tool you want to use 
   */ 
  tools: { 
    image: SimpleImage,
    header: Header, 
    list: List,
    checklist: {
      class: Checklist,
      inlineToolbar: true,
    },
    raw: RawTool,
  }, 
})