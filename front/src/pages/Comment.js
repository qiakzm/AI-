import Toast from 'react-bootstrap/Toast';
import { useState, useEffect } from 'react';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

function Comment({ id, commentWriter, commentContents, createdTime }) {
  const [commentcheckuser, setcommentcheckuser] = useState(false);

  const cookies = new Cookies();
  const jwtToken = cookies.get('jwtToken');

  const time = createdTime.substr(0, 10);

  useEffect(() => {
    if (jwtToken) {
      axios
        .get(`http://localhost:8080/api/comments/${id}/check`, {
          headers: {
            Authorization: jwtToken,
          },
        })
        .then((response) => {
          setcommentcheckuser(response.data);
        })
        .catch((error) => {
          console.error(error);
          setcommentcheckuser(false);
        });
    } else {
      setcommentcheckuser(false);
    }
  }, [id]);

  function deletecomment(e) {
    e.preventDefault();
    axios
      .delete(`http://localhost:8080/api/comments/delete/${id}`, {
        headers: {
          Authorization: jwtToken,
        },
      })
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Toast className="commentbox" onClose={deletecomment}>
      <Toast.Header closeButton={commentcheckuser}>
        {/* <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              /> */}
        <strong className="me-auto">{commentWriter}</strong>
        <small>{time}</small>
      </Toast.Header>
      <Toast.Body>{commentContents}</Toast.Body>
    </Toast>
  );
}

export default Comment;
