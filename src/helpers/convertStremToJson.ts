

export async function convertStreamToJson(stream: ReadableStream) {
    const reader = stream.getReader();
    let result = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += new TextDecoder().decode(value);
    }
    
    return JSON.parse(result);
  }