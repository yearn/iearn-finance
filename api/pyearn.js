const axios = require('axios')

module.exports = async (req, res) => {
  const symbols = []
  const values = []
  try {
    const data = (await axios({
      method: 'get',
      url: 'https://py-earn.herokuapp.com/',
    })).data
  
    for (let i = 0; i < data.props.children.length; i += 1) {
        const arr = data.props.children
        if (arr[i].type === 'Center') symbols.push(arr[i].props.children[0].props.children)
        if (arr[i].type === 'Table') values.push(arr[i].props.children[1].props.children[2].props.children[3].props.children)
    }
    return res.json({
      body: { success: true, data: symbols.map((s, i) => ({ symbol: s, value: values[i] })) },
    })
  } catch (e) {
    console.error('ERROR', e.toString())
    return res.json({
      body: { success: false, error: e.toString() },
    })
  }
}
