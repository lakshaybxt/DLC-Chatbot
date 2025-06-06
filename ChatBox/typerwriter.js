export function typeWriterEffect() {
    const text = "Ask Bennam AI Anything";
    const heading = document.getElementById('typewriter');

    let index = 0
    function typeWriter() {
        if(index < text.length) {
            heading.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, 100); 
        }
    } 

    heading.innerHTML = ""; 
    typeWriter();   
}