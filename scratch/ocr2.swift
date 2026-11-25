import Cocoa
import Vision

let imagePath = "public/images/platform-settings-languages.png"
guard let img = NSImage(contentsOfFile: imagePath) else {
    print("Failed to load image")
    exit(1)
}

guard let cgImg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    print("Failed to create cgImage")
    exit(1)
}

let request = VNRecognizeTextRequest { request, error in
    if let error = error {
        print("Error: \(error)")
        return
    }
    guard let observations = request.results as? [VNRecognizedTextObservation] else {
        print("No observations")
        return
    }
    for obs in observations {
        if let candidate = obs.topCandidates(1).first {
            let box = obs.boundingBox
            print(String(format: "y:%.4f x:%.4f w:%.4f h:%.4f | %@", box.origin.y, box.origin.x, box.size.width, box.size.height, candidate.string))
        }
    }
}
request.recognitionLevel = .accurate

let handler = VNImageRequestHandler(cgImage: cgImg, options: [:])
do {
    try handler.perform([request])
} catch {
    print("Handler error: \(error)")
}
