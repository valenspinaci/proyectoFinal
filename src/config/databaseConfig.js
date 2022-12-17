const options = {
    firebase:{
        client:"firebase",
            "type": "service_account",
            "project_id": "backend-coder-33bc9",
            "private_key_id": "d8237783f5a9cbc4d636453bb2cd29f408efd054",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC9zv8MeG03de56\nbuGP0VCFa0LPI0f0opKRQ6R7XmJc+HIa35lGG/ilC/m50PGzZ0g07UYU4KtPowpF\n6LNzkGy4l0A1kKX+wX+S9VaG44bmdG+AyNcfhfVhZ2N2m8X+IyM5HWn5E97SkXly\nZqe9ydARV/T4eIMd3lDOoL3Prh1jMBBX+EP+Hy5h52EPuprhObvRpPMX/F3GyaAb\ntEamWnN9BlFOLHpnR5mvDD4Q4I3a9JNJaPPUTQY4LFADE6YXVL+iAheDgzjhh9gO\nVB6qGgfhN7z2CuhXjpIfPJoqbf85ypUS+Z0qj3zooQEI6nNvFrO8PTU4uNFOX48x\n/GCzjThhAgMBAAECggEAXS912fp5rEPSy/sJ9GCQBqCNUUKB/iGekYDDDOpeokQ7\nSORDzL7IyMbjWI2zTB/FvG5M/Mz8bgGedonzKCZcqhdfp6yXQkZfSpf2XgzwWs4J\nPBHeQ5SxzptCoqWBg+5eSZkeQPG3cGuJU1gAvFWLOCiVlTMdNBnEVF1oMsDJnrrO\nmaKt1S0cmud/GUNMBYa+SE3TYo5cFAS/Yuz5uJCrgp3Sh1F3WvTEsFNcfAg9LTjV\nUxmrKHC+t1eso1HcMsjl/D5hSJk5t2suKnbutdibkYi5V8e5GntDTVXN02IoYngk\nybq/SdsjyKWI4kn/0/51r1aL7rEE8WcqKcV7cuKIvQKBgQDhxwMD89wU2/hSkphN\nZXOtF0JFsaJMy5/+WGvEOCJad1zV2AiyAAyS+BT1CsGsvnKzI4/61dbK6hMiI3fW\nuWyai+8SGDihMhtMbIHMW8HOMd3WVORk17gG8gP85rrOlFFrrLO2DKkk1kHFKH8D\nH/p6qhinwYL0OQ5YjIVP4w99VwKBgQDXN2XGaRBpILHU1oeqgxyFr2WNVw+9Xw7G\niEhy2vswssbTG+nKY5XkY8GxHZISW7zJ/VNA+8HliI882weZtADR3DhC5B9cxzsL\nITRDtSfk8n5f2byIv7/mthZ6zaxtyXjhldMhXIekDMq+5cRybvc6UleDAkpKcyWx\n5puRe9utBwKBgCkRezHv3LuKm6vhcIS7jIQStAJbYmtXqr2oNcoWb+FGzwMy7bn7\nGk5tg9pi34Hdjp2ZPWpiFVUJqPtPuk+7oM6n34/KChsAM0j+f8m9cw5fsbt366eQ\nObBBu4n4KkjDX+AXJQVbXjUOKB6F1DysR3KimCODpp9n9X0T6nfylHG3AoGAOuZe\nZD68zwizopxT5MadN7kZAeWh2SH62TrTGRv1Qw6qe3xYL5uxmh/zEpYVNBEHSgCa\nmF5OYpNNIEqRee9ZihXLEAN+0dV0w0cDFsStdmsnSvQ8NPDFhE6xOEqxtho9iv+G\nGMtKFAusMTKQ4QCdiMigSqqFynpZBqcmTFqpdGECgYBhShcW6MraDU2eFuDTHe+N\nsu5sffZOEZx/Op4FsWcC2XwX/Dz5WPs7hbu/ED34aw4DW1MCP/rm90yR9i4CPcWT\nbdEgc/H876i9LRbwh8AxK4aeypO4ylZXNtZcN5ajBF+6Ag/bpSSYopguIlZiQJI2\ntRl2pYyDD7spPfsM5EqchA==\n-----END PRIVATE KEY-----\n",
            "client_email": "firebase-adminsdk-2ykyw@backend-coder-33bc9.iam.gserviceaccount.com",
            "client_id": "111561170242978457392",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-2ykyw%40backend-coder-33bc9.iam.gserviceaccount.com"
    },
    mongoDB:{
        client:"mongoDB",
            useNewUrlParser:true,
            useUnifiedTopology:true,
            dbURL: "mongodb+srv://valenspinaci:Valentino26@backend-coder.ksqybs9.mongodb.net/ecommerce?retryWrites=true&w=majority"
    }
}

export {options}