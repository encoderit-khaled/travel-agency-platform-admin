
import Cocoa
import Vision

guard let img = NSImage(contentsOfFile: "public/images/platform-settings-languages.png"),
      let cgImg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    exit(1)
}

let request = VNRecognizeTextRequest { request, error in
    guard let observations = request.results as? [VNRecognizedTextObservation] else { return }
    for obs in observations {
        if let candidate = obs.topCandidates(1).first {
            let box = obs.boundingBox
            print("\(candidate.string) [y:\(box.origin.y), x:\(box.origin.x)]")
        }
    }
}
request.recognitionLevel = .accurate

let handler = VNImageRequestHandler(cgImage: cgImg, options: [:])
try? handler.perform([request])
