import { TIMEOUT_SEC } from './config';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    // 解析请求数据
    const data = await res.json();
    //请求是否成功
    if (!res.ok) throw new Error(`${data.message} (${data.status})`);
    return data;
  } catch (error) {
    throw error;
  }
};

// export const getJSON = async function (url) {
//   try {
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//     // 解析请求数据
//     const data = await res.json();
//     //请求是否成功
//     if (!res.ok) throw new Error(`${data.message} (${data.status})`);
//     return data;
//   } catch (error) {
//     // alert(error);
//     throw error;
//     // throw Error(error);
//   }
// };
// export const sendJSON = async function (url, uploadData) {
//   try {
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     // 解析请求数据
//     const data = await res.json();
//     //请求是否成功
//     if (!res.ok) throw new Error(`${data.message} (${data.status})`);
//     return data;
//   } catch (error) {
//     // alert(error);
//     throw error;
//     // throw Error(error);
//   }
// };
