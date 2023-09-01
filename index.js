import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://boqtojielnwxlrffznaa.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvcXRvamllbG53eGxyZmZ6bmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjkwMTUzMTksImV4cCI6MTk4NDU5MTMxOX0.GgL4KE7xK15T1233y9jS_2_Jv1cMwGzsiXkGOqjilrw"
);

// FUNCTION FOR COUNTDOWN

function getTimeComment(unixTime) {
  const time = new Date(unixTime);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const locale = "id-ID";
  const formattedDate = time.toLocaleDateString(locale, options);
  return formattedDate;
}

// make function get Data coments
async function getDataComment() {
  try {
    const { data, error } = await supabase.from("comments").select("*");
    console.log("data", data);
    function createHTMLFromData(data) {
      const container = document.getElementById("container-comment");

      data?.forEach((item) => {
        const itemLi = document.createElement("li");
        itemLi.className = "li list-group-item";

        const nameUser = document.createElement("H5");
        nameUser.className = "font-bold mb-2";
        nameUser.textContent = item.name;
        itemLi.appendChild(nameUser);

        const greetingText = document.createElement("p");
        greetingText.className = "text-lg font-light mb-3";
        greetingText.textContent = item.greeting;
        itemLi.appendChild(greetingText);

        const dateComment = document.createElement("div");
        dateComment.className = "text-dark-500 font-light";
        dateComment.textContent = getTimeComment(item.created_at);
        itemLi.appendChild(dateComment);

        container.appendChild(itemLi);
      });
    }
    createHTMLFromData(data);
  } catch (error) {
    console.log(error);
  }
}

getDataComment();

const form = document.getElementById("greeting-form");
const namaInput = document.getElementById("nama");
const nohpInput = document.getElementById("nohp");
const kehadiranSelect = document.getElementsByName("flexRadioDefault");
const ucapanTextarea = document.getElementById("ucapan");
const sendButton = document.getElementById("send-greeting");

function onChangeHandler(event) {
  const inputName = event.target.id;
  const inputValue = event.target.value;
}

async function onSubmitHandler(event) {
  event.preventDefault();

  let selectedValue;

  for (const radio of kehadiranSelect) {
    if (radio.checked) {
      selectedValue = radio.id;
      break;
    }
  }

  const formData = {
    name: namaInput.value,
    nohp: nohpInput.value,
    present: selectedValue === "flexRadioDefault1",
    greeting: ucapanTextarea.value,
  };

  console.log("form data", formData);

  if (!formData.name || !formData.nohp || !formData.greeting) {
    alert("Harap isi semua form RSVP!!!");
    return;
  }

  // You can perform any actions with the formData here

  const { data, error } = await supabase
    .from("comments")
    .insert([formData])
    .select();

  if (data) {
    Swal.fire(
      "Ucapanmu Terkirim!",
      "Terimakasih yaa sudah mendoakan☺️",
      "success"
    ).then(() => {
      window.location.reload();
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Ucapanmu belum terkirim, coba lagi ya!",
    });
  }
}

namaInput.addEventListener("change", onChangeHandler);
nohpInput.addEventListener("change", onChangeHandler);
ucapanTextarea.addEventListener("change", onChangeHandler);
sendButton.addEventListener("click", onSubmitHandler);
