import inlinePluginFactory from './inline_plugin'

const inline_smile = inlinePluginFactory('smile','$$',function(tokens,idx){
    return '<span>Riddleoo smiles to '+tokens[idx].meta+'</span>'
})

export default inline_smile 