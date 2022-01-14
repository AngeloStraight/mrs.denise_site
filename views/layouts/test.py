def solution(A,B, N):
    clusters = []


    for i in range(N):
        if clusters:
            for j in clusters:
                for k in clusters[j]:
                    if A[i] or B[i] in clusters[j][k]:
                        clusters[j].append([A[i],B[i]])
        else:
            clusters.append([[A[i], B[i]]])

    
