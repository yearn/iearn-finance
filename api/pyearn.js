const axios = require('axios')

module.exports = async (req, res) => {
  const data = (await axios({
    method: 'GET',
    url: 'https://py-earn.herokuapp.com/',
  })).data
  const symbols = []
  for (let i = 0; i < data.props.children.length; i += 1) {
      const arr1 = data.props.children
      if (arr1[i].type === 'Center') symbols.push(arr1[i].props.children[0].props.children)
  }
  const values = []
  for (let i = 0; i < data.props.children.length; i += 1) {
      const arr1 = data.props.children
      if (arr1[i].type === 'Table') values.push(arr1[i].props.children[1].props.children[2].props.children[3].props.children)
  }
  return res.json({
    body: symbols.map((s, i) => ({ symbol: s, value: values[i] })),
  })
}
