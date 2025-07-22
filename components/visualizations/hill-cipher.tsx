"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Key, Lock, Unlock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function HillCipher() {
  const [plaintext, setPlaintext] = useState("HELLO")
  const [keyMatrix, setKeyMatrix] = useState([[3, 2], [5, 7]])
  const [ciphertext, setCiphertext] = useState("")
  const [decryptedText, setDecryptedText] = useState("")
  const [inverseMatrix, setInverseMatrix] = useState<number[][] | null>(null)
  const [error, setError] = useState("")
  const [showCalculations, setShowCalculations] = useState(false)
  const [encryptionSteps, setEncryptionSteps] = useState<string[]>([])
  const [decryptionSteps, setDecryptionSteps] = useState<string[]>([])

  // Convert letter to number (A=0, B=1, ..., Z=25)
  const letterToNumber = (letter: string): number => {
    return letter.toUpperCase().charCodeAt(0) - 65
  }

  // Convert number to letter (0=A, 1=B, ..., 25=Z)
  const numberToLetter = (num: number): string => {
    return String.fromCharCode(((num % 26) + 26) % 26 + 65)
  }

  // Calculate determinant of 2x2 matrix
  const determinant2x2 = (matrix: number[][]): number => {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
  }

  // Calculate modular inverse using Extended Euclidean Algorithm
  const modInverse = (a: number, m: number): number | null => {
    a = ((a % m) + m) % m
    for (let x = 1; x < m; x++) {
      if ((a * x) % m === 1) {
        return x
      }
    }
    return null
  }

  // Calculate inverse of 2x2 matrix modulo 26
  const matrixInverse = (matrix: number[][]): number[][] | null => {
    const det = determinant2x2(matrix)
    let detMod = ((det % 26) + 26) % 26
    const detInv = modInverse(detMod, 26)
    
    if (detInv === null) {
      return null
    }

    // Calculate adjugate matrix
    const adjugate = [
      [matrix[1][1], -matrix[0][1]],
      [-matrix[1][0], matrix[0][0]]
    ]

    // Apply modular inverse of determinant to adjugate
    return adjugate.map(row => 
      row.map(val => {
        const result = (val * detInv) % 26
        return ((result % 26) + 26) % 26
      })
    )
  }

  // Matrix multiplication modulo 26
  const matrixMultiply = (matrix: number[][], vector: number[]): number[] => {
    return matrix.map(row => {
      const result = row[0] * vector[0] + row[1] * vector[1]
      return ((result % 26) + 26) % 26
    })
  }

  // Encrypt text
  const encrypt = (text: string, key: number[][]): { result: string; steps: string[] } => {
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, "")
    const steps: string[] = []
    let result = ""

    // Pad text if odd length
    const paddedText = cleanText.length % 2 === 1 ? cleanText + "X" : cleanText
    steps.push(`1. Cleaned text: "${cleanText}"`)
    if (paddedText !== cleanText) {
      steps.push(`2. Padded text: "${paddedText}" (added X for even length)`)
    }

    steps.push(`3. Key matrix K = [[${key[0][0]}, ${key[0][1]}], [${key[1][0]}, ${key[1][1]}]]`)

    for (let i = 0; i < paddedText.length; i += 2) {
      const block = [letterToNumber(paddedText[i]), letterToNumber(paddedText[i + 1])]
      const stepNum = Math.floor(i / 2) + 4
      
      steps.push(`${stepNum}. Block "${paddedText[i]}${paddedText[i + 1]}" → [${block[0]}, ${block[1]}]`)
      
      // Show matrix multiplication step by step
      const row1Result = key[0][0] * block[0] + key[0][1] * block[1]
      const row2Result = key[1][0] * block[0] + key[1][1] * block[1]
      
      steps.push(`    [${key[0][0]} ${key[0][1]}] × [${block[0]}] = [${key[0][0]}×${block[0]} + ${key[0][1]}×${block[1]}] = [${row1Result}]`)
      steps.push(`    [${key[1][0]} ${key[1][1]}]   [${block[1]}]   [${key[1][0]}×${block[0]} + ${key[1][1]}×${block[1]}]   [${row2Result}]`)
      
      const encrypted = matrixMultiply(key, block)
      const encryptedLetters = encrypted.map(numberToLetter)
      
      steps.push(`    [${row1Result}] mod 26 = [${encrypted[0]}] → "${encryptedLetters.join("")}"`)
      steps.push(`    [${row2Result}]        [${encrypted[1]}]`)
      
      result += encryptedLetters.join("")
    }

    steps.push(`Final result: "${result}"`)
    return { result, steps }
  }

  // Decrypt text
  const decrypt = (text: string, key: number[][]): { result: string; steps: string[] } => {
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, "")
    const steps: string[] = []
    let result = ""

    const inverse = matrixInverse(key)
    if (!inverse) {
      steps.push("Error: Cannot compute matrix inverse")
      return { result: "", steps }
    }

    steps.push(`1. Original key matrix K = [[${key[0][0]}, ${key[0][1]}], [${key[1][0]}, ${key[1][1]}]]`)
    steps.push(`2. Inverse key matrix K⁻¹ = [[${inverse[0][0]}, ${inverse[0][1]}], [${inverse[1][0]}, ${inverse[1][1]}]]`)

    for (let i = 0; i < cleanText.length; i += 2) {
      const block = [letterToNumber(cleanText[i]), letterToNumber(cleanText[i + 1])]
      const stepNum = Math.floor(i / 2) + 3
      
      steps.push(`${stepNum}. Cipher block "${cleanText[i]}${cleanText[i + 1]}" → [${block[0]}, ${block[1]}]`)
      
      // Show matrix multiplication step by step
      const row1Result = inverse[0][0] * block[0] + inverse[0][1] * block[1]
      const row2Result = inverse[1][0] * block[0] + inverse[1][1] * block[1]
      
      steps.push(`    [${inverse[0][0]} ${inverse[0][1]}] × [${block[0]}] = [${inverse[0][0]}×${block[0]} + ${inverse[0][1]}×${block[1]}] = [${row1Result}]`)
      steps.push(`    [${inverse[1][0]} ${inverse[1][1]}]   [${block[1]}]   [${inverse[1][0]}×${block[0]} + ${inverse[1][1]}×${block[1]}]   [${row2Result}]`)
      
      const decrypted = matrixMultiply(inverse, block)
      const decryptedLetters = decrypted.map(numberToLetter)
      
      steps.push(`    [${row1Result}] mod 26 = [${decrypted[0]}] → "${decryptedLetters.join("")}"`)
      steps.push(`    [${row2Result}]        [${decrypted[1]}]`)
      
      result += decryptedLetters.join("")
    }

    steps.push(`Final result: "${result}"`)
    return { result, steps }
  }

  const handleEncrypt = () => {
    setError("")
    try {
      // Check if matrix is invertible
      const inv = matrixInverse(keyMatrix)
      if (!inv) {
        setError("Matrix is not invertible modulo 26. Please choose a different key matrix.")
        return
      }
      setInverseMatrix(inv)

      const { result, steps } = encrypt(plaintext, keyMatrix)
      setCiphertext(result)
      setEncryptionSteps(steps)
    } catch (err) {
      setError("Encryption failed. Please check your inputs.")
    }
  }

  const handleDecrypt = () => {
    setError("")
    try {
      if (!inverseMatrix) {
        setError("Please encrypt first to calculate the inverse matrix.")
        return
      }

      const { result, steps } = decrypt(ciphertext, keyMatrix)
      setDecryptedText(result)
      setDecryptionSteps(steps)
    } catch (err) {
      setError("Decryption failed. Please check your inputs.")
    }
  }

  const updateKeyMatrix = (row: number, col: number, value: string) => {
    const newMatrix = [...keyMatrix]
    newMatrix[row][col] = parseInt(value) || 0
    setKeyMatrix(newMatrix)
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Hill Cipher Interactive Demo
          </CardTitle>
          <CardDescription>
            Encrypt and decrypt messages using the Hill cipher with 2×2 matrices. 
            The inverse matrix is automatically calculated for decryption testing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="plaintext">Plaintext Message</Label>
                <Textarea
                  id="plaintext"
                  value={plaintext}
                  onChange={(e) => setPlaintext(e.target.value)}
                  placeholder="Enter your message (letters only)"
                  className="font-mono"
                />
              </div>

              <div>
                <Label>Key Matrix (2×2)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {keyMatrix.map((row, i) =>
                    row.map((val, j) => (
                      <Input
                        key={`${i}-${j}`}
                        type="number"
                        value={val}
                        onChange={(e) => updateKeyMatrix(i, j, e.target.value)}
                        className="text-center font-mono"
                      />
                    ))
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Matrix: [[{keyMatrix[0][0]}, {keyMatrix[0][1]}], [{keyMatrix[1][0]}, {keyMatrix[1][1]}]]
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleEncrypt} className="flex-1">
                  <Lock className="w-4 h-4 mr-2" />
                  Encrypt
                </Button>
                <Button onClick={handleDecrypt} variant="outline" className="flex-1" disabled={!ciphertext}>
                  <Unlock className="w-4 h-4 mr-2" />
                  Decrypt
                </Button>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              <div>
                <Label>Ciphertext</Label>
                <Textarea
                  value={ciphertext}
                  readOnly
                  className="font-mono bg-muted"
                  placeholder="Encrypted text will appear here"
                />
              </div>

              <div>
                <Label>Decrypted Text</Label>
                <Textarea
                  value={decryptedText}
                  readOnly
                  className="font-mono bg-muted"
                  placeholder="Decrypted text will appear here"
                />
              </div>

              {inverseMatrix && (
                <div>
                  <Label>Inverse Key Matrix (K⁻¹)</Label>
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <div className="text-sm font-mono">
                      K⁻¹ = [[{inverseMatrix[0][0]}, {inverseMatrix[0][1]}], [{inverseMatrix[1][0]}, {inverseMatrix[1][1]}]]
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Calculation Steps */}
          <div>
            <Button
              variant="outline"
              onClick={() => setShowCalculations(!showCalculations)}
              className="mb-4"
            >
              {showCalculations ? "Hide" : "Show"} Step-by-Step Calculations
            </Button>

            {showCalculations && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {encryptionSteps.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Encryption Steps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {encryptionSteps.map((step, index) => (
                          <div key={index} className="text-sm font-mono bg-muted p-2 rounded">
                            {step}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {decryptionSteps.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Decryption Steps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {decryptionSteps.map((step, index) => (
                          <div key={index} className="text-sm font-mono bg-muted p-2 rounded">
                            {step}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Information */}
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900 dark:text-blue-100">How it Works</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-800 dark:text-blue-200">
              <ul className="space-y-2 text-sm">
                <li><strong>Encryption:</strong> C = K × P (mod 26)</li>
                <li><strong>Decryption:</strong> P = K⁻¹ × C (mod 26)</li>
                <li>The key matrix must be invertible modulo 26</li>
                <li>Text is processed in 2-letter blocks</li>
                <li>Odd-length messages are padded with 'X'</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
