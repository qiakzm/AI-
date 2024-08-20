import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function EmailCheckAuth(url) {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(url).then((res) => setData(res.data));
  }, [url]);

  return data; // 넘겨줄 요소들을 return한다
}
